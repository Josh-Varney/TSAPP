import { db } from "./firebase.js"; // Adjust the import as necessary
import { getAllTeacherIDs, checkTeacherID } from "./firestore-teachers.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore"; // Import necessary Firestore functions

// Helper: Check Validity of Date string or Date objects
function isValidDate(input) {
    const date = input instanceof Date ? input : new Date(input);
    return !isNaN(date.getTime());
}

// Helper: Get Current Date in YYYY-MM-DD format
async function getCurrentDate() {
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
}

// Helper: Get Current Time in HH:MM:SS UTC format
async function getCurrentTime() {
    const currentDate = new Date();
    return `${currentDate.getUTCHours().toString().padStart(2, '0')}:${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} UTC`;
}

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

// Helper: Get Fully Booked Times
function getFullyBookedTimes(teachers, bookings) {
    const fullyBookedTimes = new Set();
    const uniqueTimes = [...new Set(bookings.map(booking => booking.time))];

    uniqueTimes.forEach(time => {
        const allBooked = teachers.every(teacherID => {
            const booking = bookings.find(b => b.teacherID === teacherID && b.time === time);
            return booking && booking.isBooked;
        });
        if (allBooked) fullyBookedTimes.add(time);
    });

    return [...fullyBookedTimes];
}

// Helper: Generate Available Times from Given Range
function generateRemainingTimes(providedTimes = [], startTime = '8:00 AM', endTime = '8:00 PM') {
    const times = [];
    const convertTo24Hour = timeStr => {
        let [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        return new Date(1970, 0, 1, hours, minutes);
    };
    const formatTo12Hour = date => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let currentTime = convertTo24Hour(startTime);
    const endTimeDate = convertTo24Hour(endTime);
    const providedTimesSet = new Set(providedTimes.map(time => time.toUpperCase()));

    while (currentTime <= endTimeDate) {
        const formattedTime = formatTo12Hour(currentTime);
        if (!providedTimesSet.has(formattedTime.toUpperCase())) {
            times.push(formattedTime);
        }
        currentTime.setHours(currentTime.getHours() + 1);
    }

    return times;
}
