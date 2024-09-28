import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { checkTeacherID } from "./firestore-teachers.js";
import { getAllTeacherIDs } from "./firestore-teachers.js";

// Helper function to convert a 12-hour time string to an equivalent Date object
function parseTime12(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12; // Convert PM hours to 24-hour format for easier comparison
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
    }

    // Return a Date object for easier manipulation
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
}

// Helper function to convert a Date object back to a 12-hour formatted string
function formatTime12(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const modifier = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
        hours -= 12; // Convert to 12-hour format
    } else if (hours === 0) {
        hours = 12; // Adjust for 12 AM
    }

    return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
}

async function checkTeacherAvailability(teacherID, date, requestedTime12h) {
    try {
        // Validate the teacher ID
        const IDValidity = await checkTeacherID(teacherID);
        if (!IDValidity) {
            throw new Error("ERROR: INVALID ID");
        }

        // Log the incoming parameters
        console.log("Checking availability for:", { teacherID, date, requestedTime12h });

        // Reference to the document for the specific date in the 'scheduler' collection
        const docRef = doc(db, 'scheduler', date);
        const docSnap = await getDoc(docRef);

        // If there's no document for the date, the teacher is available
        if (!docSnap.exists()) {
            console.log(`No schedule found for ${date}. Teacher ${teacherID} is available.`);
            return true;
        }

        // Get the existing schedule for the day or use an empty object if none exists
        const existingSchedule = docSnap.data()?.schedule || {};
        console.log("Existing Schedule:", existingSchedule);

        // Parse the requested time into a Date object
        const requestedTime = parseTime12(requestedTime12h);
        if (!requestedTime) {
            throw new Error("ERROR: INVALID REQUESTED TIME");
        }
        console.log("Parsed Requested Time:", requestedTime);

        // Loop through each booked time slot
        for (let [startTime12h, bookings] of Object.entries(existingSchedule)) {
            // Parse the start time into a Date object
            const startTime = parseTime12(startTime12h);
            if (!startTime) {
                console.warn(`Invalid start time for ${startTime12h}`);
                continue; // Skip to the next entry if the start time is invalid
            }

            // Iterate through each booking at this start time
            for (let booking of bookings) {
                const { teacherID: bookedTeacherID, bookingDetails } = booking;

                // If the current booking is for the requested teacher
                if (bookedTeacherID === teacherID) {
                    const lessonDuration = bookingDetails.duration || 0; // Duration in minutes
                    const bookingEndTime = new Date(startTime.getTime() + lessonDuration * 60000); // Calculate end time in milliseconds

                    // Check for time overlap
                    if (requestedTime >= startTime && requestedTime < bookingEndTime) {
                        console.log(
                            `Teacher ${teacherID} is not available. They are booked from ${startTime12h} for ${lessonDuration} minutes (until ${formatTime12(bookingEndTime)}).`
                        );
                        return false; // Conflict found
                    }
                }
            }
        } 

        // No overlap found, teacher is available
        console.log(`Teacher ${teacherID} is available at ${requestedTime12h} on ${date}.`);
        return true;

    } catch (error) {
        console.log("Check Teacher Availability Error: ", error);
    }
}

// NOTE: THIS WILL TELL ME IF A TEACHER CAN ATTEND ON THE TIME THEY ARE DUE AND HOW LONG FOR BEFORE THE NEXT SLOT 
async function getAvailableSlots(teacherID, date, requestedTime12h) {
    try {
        // Validate the teacher ID (this function is assumed to exist)
        const IDValidity = await checkTeacherID(teacherID);
        if (!IDValidity) {
            throw new Error("ERROR: INVALID ID");
        }

        // Reference to the document for the specific date in the 'scheduler' collection
        const docRef = doc(db, 'scheduler', date);
        const docSnap = await getDoc(docRef);

        // If there's no document for the date, the teacher is available for the entire day
        if (!docSnap.exists()) {
            return { '30 mins': true, '60 mins': true, '90 mins': true }; // All slots are available
        }

        // Get the existing schedule for the day or use an empty object if none exists
        const existingSchedule = docSnap.data()?.schedule || {};
        const requestedTime = parseTime12(requestedTime12h);
        
        // Initialize a variable to track the next booking time
        let nextBookingTime = null;

        // Loop through each booked time slot
        for (let [startTime12h, bookings] of Object.entries(existingSchedule)) {
            // Parse the start time into a Date object
            const startTime = parseTime12(startTime12h);

            // Iterate through each booking at this start time
            for (let booking of bookings) {
                const { teacherID: bookedTeacherID, bookingDetails } = booking;

                // Only consider bookings for the requested teacher
                if (bookedTeacherID === teacherID) {
                    const lessonDuration = bookingDetails.duration || 0; // Duration in minutes
                    const bookingEndTime = new Date(startTime.getTime() + lessonDuration * 60000); // Calculate end time

                    // If the current booking starts after the requested time, update nextBookingTime
                    if (startTime > requestedTime) {
                        nextBookingTime = nextBookingTime ? Math.min(nextBookingTime, startTime) : startTime;
                    }
                }
            }
        }

        // Now check if 30 mins, 60 mins, and 90 mins can be booked before the next booking
        const availableSlots = {
            '30 mins': true,
            '60 mins': true,
            '90 mins': true
        };

        // Determine the current time in minutes since midnight
        const currentTimeInMinutes = requestedTime.getHours() * 60 + requestedTime.getMinutes();

        // Check for 30 mins availability
        if (nextBookingTime) {
            const nextBookingInMinutes = nextBookingTime.getHours() * 60 + nextBookingTime.getMinutes();
            
            // Check if the end time for a 30-minute booking is before the next booking time
            if (currentTimeInMinutes + 30 > nextBookingInMinutes) {
                availableSlots['30 mins'] = false; // No availability for 30 mins
            }

            // Check for 60 mins availability
            if (currentTimeInMinutes + 60 > nextBookingInMinutes) {
                availableSlots['60 mins'] = false; // No availability for 60 mins
            }

            // Check for 90 mins availability
            if (currentTimeInMinutes + 90 > nextBookingInMinutes) {
                availableSlots['90 mins'] = false; // No availability for 90 mins
            }
        }

        return availableSlots;

    } catch (error) {
        console.log("Get Available Slots Error: ", error);
        return null; // Return null in case of error
    }
}

function generateTimeSlots() {
    const timeSlots = [];
    let currentHour = 8; // Start at 8 AM
    const endHour = 20; // End at 8 PM

    // Generate time slots from 8:00 AM to 8:00 PM
    while (currentHour < endHour || (currentHour === endHour && timeSlots.length < 1)) {
        for (let minute of [0, 30]) {
            // Format time as HH:MM AM/PM
            const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12; // Convert to 12-hour format
            const formattedTime = `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${currentHour < 12 ? 'AM' : 'PM'}`;
            timeSlots.push(formattedTime);
        }
        currentHour++; // Move to the next hour
    }

    // Add the last time slot for 8:00 PM
    timeSlots.push('08:00 PM');

    return timeSlots;
}


async function findFullyBookedSlots(date) {
    const timeSlots = generateTimeSlots(); // Get the time slots
    const teacherIDs = await getAllTeacherIDs(); // Fetch teacher IDs
    const numericTeacherIDs = teacherIDs.map(id => Number(id));
    const fullyBooked = []; // Array to store fully booked slots

    // Loop through each time slot
    for (let time of timeSlots) {
        const availableTeachers = await checkAllTeacherAvailability(numericTeacherIDs, date, time);
        if (availableTeachers.length === 0) {
            fullyBooked.push(time); // If no available teachers, push the time slot to fullyBooked
        }
    }
    return fullyBooked; // Return the list of fully booked time slots
}

async function checkAllTeacherAvailability(teacherIDList, date, time) {
    if (teacherIDList && Array.isArray(teacherIDList)) {
        // Array to hold IDs of available teachers
        const availableTeacherIDs = [];

        // Create an array of promises for each teacher's availability check
        const availabilityChecks = teacherIDList.map(async (teacherID) => {
            const isAvailable = await checkTeacherAvailability(teacherID, date, time);
            if (isAvailable) {
                availableTeacherIDs.push(teacherID); // Push to the array if available
            }
        });

        // Wait for all availability checks to complete
        await Promise.all(availabilityChecks);

        // Return the available teacher IDs
        return availableTeacherIDs;
    } else {
        throw new Error("Invalid teacher ID list provided.");
    }
}

// const ids = await checkAllTeacherAvailability([1, 2, 3], "2024-09-28", "05:00 PM");
// const lessonLength = await getAvailableSlots(2, "2024-09-28", "04:00 PM")
// console.log(lessonLength);
// const fullyBookedSlots = await findFullyBookedSlots("2024-09-28");
// console.log(fullyBookedSlots);