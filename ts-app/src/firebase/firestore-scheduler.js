import { db } from "./firebase.js"; // Adjust the import as necessary
import { getAllTeacherIDs, checkTeacherID } from "./firestore-teachers.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    runTransaction,
} from "firebase/firestore"; 
import { getFullyBookedTimes, getCurrentTime, generateRemainingTimes, getTime } from "../utils/time-functions/getBookingTimes.js";
import { isToday, isValidDate, getCurrentDate } from "../utils/time-functions/getDate.js";
import { isValidTime } from "../utils/time-functions/getBookingTimes.js";
import { addMinutes, isValid, parse } from 'date-fns'

// Book a Lesson for a Teacher
export async function bookLessonForTeacher(teacherID, bookingDate, bookingTime, userEmail, tutorSubject, tutorDescription, lessonDuration) {
    try {
        // Validate input fields
        if (!teacherID || !bookingDate || !bookingTime || !userEmail || !tutorSubject || !tutorDescription || !lessonDuration) {
            console.log("Missing required booking information.");
            return;
        }

        if (!checkTeacherID(teacherID)) {
            console.log("Not an Authenticated Teacher");
            return;
        }

        const bookingData = {
            teacherID,
            bookingDetails: {
                bookedBy: userEmail,
                bookingDate: bookingDate,
                bookingTime: bookingTime,
                subjectName: tutorSubject,
                lessonDescription: tutorDescription,
                duration: lessonDuration, 
                isBooked: true,
            },
        };

        const docRef = doc(db, 'scheduler', bookingDate); 

        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);
            let existingSchedule = docSnap.exists() ? docSnap.data().schedule || {} : {};
            let bookingsAtTime = existingSchedule[bookingTime] || [];

            const isTeacherAlreadyBooked = bookingsAtTime.some(booking => booking.teacherID === teacherID);

            if (isTeacherAlreadyBooked) {
                console.log('Teacher is already booked at this time.');
                return;
            }

            bookingsAtTime.push(bookingData);
            existingSchedule[bookingTime] = bookingsAtTime;

            transaction.set(docRef, { schedule: existingSchedule }, { merge: true });
        });

        console.log("Booking added successfully for teacher:", teacherID);

    } catch (error) {
        console.error("Error booking the lesson:", error.message, error.stack);
    }
}

// Delete a Teacher's Booking
export async function deleteBookingForTeacher(teacherID, bookingDate, bookingTime) {
    try {
        // Validate input fields
        if (!teacherID || !bookingDate || !bookingTime) {
            console.log("Missing required parameters for deleting booking.");
            return;
        }

        const docRef = doc(db, 'scheduler', bookingDate);

        // Use a transaction to ensure data integrity
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);

            if (!docSnap.exists()) {
                console.log('No bookings found for the specified date.');
                return;
            }

            let existingSchedule = docSnap.data().schedule || {};
            let bookingsAtTime = existingSchedule[bookingTime] || [];

            const bookingIndex = bookingsAtTime.findIndex(booking => booking.teacherID === teacherID);

            if (bookingIndex === -1) {
                console.log('No booking found for this teacher at this time.');
                return;
            }

            // Remove the booking from the array
            bookingsAtTime.splice(bookingIndex, 1);

            // Update the schedule
            if (bookingsAtTime.length > 0) {
                existingSchedule[bookingTime] = bookingsAtTime; // Update with remaining bookings
            } else {
                delete existingSchedule[bookingTime]; // Delete the time slot if no bookings remain
            }

            // Commit the updated schedule
            transaction.set(docRef, { schedule: existingSchedule }, { merge: true });
        });

        console.log(`Booking for teacher ID ${teacherID} deleted successfully for date ${bookingDate} at time ${bookingTime}.`);

    } catch (error) {
        console.error("Error deleting the booking:", error.message, error.stack);
    }
}

// Check for Available Time Slots on a Date
export async function checkTimeSlotsFromDate(dateSelected) {

    try {
        if (!isValidDate(dateSelected)) {
            console.log("Invalid Date Entered");
            return;
        }

        const teacherIDs = await getAllTeacherIDs();
        const docRef = doc(db, 'scheduler', dateSelected);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return generateRemainingTimes([]);
        }

        const existingSchedule = docSnap.data()?.schedule || {};
        const teacherBookedSlots = [];

        Object.entries(existingSchedule).forEach(([time, teachers]) => {
            teachers.forEach(teacher => {
                teacherBookedSlots.push({
                    time,
                    teacherID: teacher.teacherID,
                    isBooked: teacher.bookingDetails.isBooked,
                });
            });
        });

        const fullyBookedTimes = getFullyBookedTimes(teacherIDs, teacherBookedSlots);

        if (isToday(dateSelected)){
            const cTime = getTime();
            return generateRemainingTimes(fullyBookedTimes, cTime);
        } else {
            return generateRemainingTimes(fullyBookedTimes);
        }

    } catch (error) {
        console.error("Error checking time slots:", error.message);
    }
}

export async function obtainFullyBookedTimes(dateSelected) {
    try {
        if (!isValidDate(dateSelected)) {
            console.log("Invalid Date Entered");
            return;
        }

        const teacherIDs = await getAllTeacherIDs();
        const docRef = doc(db, 'scheduler', dateSelected);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No schedule found for the selected date. So no booking for this time");
            return [];
        }

        const existingSchedule = docSnap.data()?.schedule || {};
        const teacherBookedSlots = [];

        Object.entries(existingSchedule).forEach(([time, teachers]) => {
            teachers.forEach(teacher => {
                teacherBookedSlots.push({
                    time,
                    teacherID: teacher.teacherID,
                    isBooked: teacher.bookingDetails.isBooked,
                });
            });
        });

        const fullyBookedTimes = getFullyBookedTimes(teacherIDs, teacherBookedSlots);

        // console.log(fullyBookedTimes);

        return fullyBookedTimes;

    } catch (error) {
        console.error("Error checking time slots:", error.message);
    }
}


// Check for Available Time Slots on a Date
export async function checkWhosAvailableAtTime(dateSelected, timeSelected) {
    try {
        if (!isValidDate(dateSelected)) {
            console.log("Invalid Date Entered");
            return [];
        }

        const teacherIDs = await getAllTeacherIDs();
        const docRef = doc(db, 'scheduler', dateSelected);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No schedule found for the selected date.");
            const teacherIDs = await getAllTeacherIDs();
            return teacherIDs;
        }

        const existingSchedule = docSnap.data()?.schedule || {};
        const bookedTeachersSet = new Set();

        if (existingSchedule[timeSelected]) {
            existingSchedule[timeSelected].forEach(teacher => {
                if (teacher.bookingDetails.isBooked) {
                    bookedTeachersSet.add(teacher.teacherID);
                }
            });
        }

        return teacherIDs.filter(teacherID => !bookedTeachersSet.has(teacherID));;

    } catch (error) {
        console.error("Error checking available teachers:", error.message);
        return [];
    }
}


// const value = await checkWhosAvailableAtTime("2024-09-28", "04:30 PM");
// console.log(value);
// bookLessonForTeacher(3, "2024-09-28", "04:30 PM", "example_user@gmail.com", "bio", "shush", "90");