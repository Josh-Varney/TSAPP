import { db } from "./firebase.js"; // Adjust the import as necessary
import { getAllTeacherIDs, checkTeacherID } from "./firestore-teachers.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore"; 
import { getFullyBookedTimes, getCurrentTime, generateRemainingTimes } from "../utils/time-functions/getBookingTimes.js";
import { isToday, getNextHour, isValidDate, getCurrentDate } from "../utils/time-functions/getDate.js";

// Book a Lesson for a Teacher
export async function bookLessonForTeacher(teacherID, bookingDate, time, userEmail, tutorSubject, tutorDescription) {
    try {
        if (!checkTeacherID(teacherID)) {
            console.log("Not an Authenticated Teacher");
            return;
        }

        const bookingData = {
            teacherID,
            bookingDetails: {
                bookedBy: userEmail,
                bookingDate: await getCurrentDate(),
                bookingTime: await getCurrentTime(),
                subjectName: tutorSubject,
                lessonDescription: tutorDescription,
                isBooked: true,
            },
        };

        const docRef = doc(db, 'scheduler', bookingDate);
        const docSnap = await getDoc(docRef);

        let existingSchedule = docSnap.exists() ? docSnap.data().schedule || {} : {};
        let bookingsAtTime = existingSchedule[time] || [];

        const isTeacherAlreadyBooked = bookingsAtTime.some(booking => booking.teacherID === teacherID);

        if (isTeacherAlreadyBooked) {
            console.log('Teacher is already booked at this time.');
            return;
        }

        bookingsAtTime.push(bookingData);
        existingSchedule[time] = bookingsAtTime;

        await setDoc(docRef, { schedule: existingSchedule }, { merge: true });
        console.log("Booking added successfully for teacher:", teacherID);

    } catch (error) {
        console.error("Error booking the lesson:", error.message);
    }
}

// Delete a Teacher's Booking
export async function deleteBookingForTeacher(teacherID, bookingDate, time) {
    try {
        const docRef = doc(db, 'scheduler', bookingDate);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log('No bookings found for the specified date.');
            return;
        }

        let existingSchedule = docSnap.data().schedule || {};
        let bookingsAtTime = existingSchedule[time] || [];

        const bookingIndex = bookingsAtTime.findIndex(booking => booking.teacherID === teacherID);

        if (bookingIndex === -1) {
            console.log('No booking found for this teacher at this time.');
            return;
        }

        bookingsAtTime.splice(bookingIndex, 1);
        existingSchedule[time] = bookingsAtTime.length > 0 ? bookingsAtTime : null;

        await updateDoc(docRef, { schedule: existingSchedule });
        console.log(`Booking for teacher ID ${teacherID} deleted successfully for date ${bookingDate} at time ${time}.`);

    } catch (error) {
        console.error("Error deleting the booking:", error.message);
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
            // console.log("No schedule found for the selected date.");
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

        const remainingTimes = generateRemainingTimes(fullyBookedTimes);
        
        console.log(remainingTimes);
        return remainingTimes;

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

// Check Available Teachers at a Specific Time
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

        const availableTeachers = teacherIDs.filter(teacherID => !bookedTeachersSet.has(teacherID));
        return availableTeachers.map(teacherID => ({ teacherID, isBooked: false }));

    } catch (error) {
        console.error("Error checking available teachers:", error.message);
        return [];
    }
}



// bookLessonForTeacher(3, "2024-09-28", "10:00 AM", "example_user@gmail.com", "bio", "shush");