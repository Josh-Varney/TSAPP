const { db } = require("./firebase-service");
const { getAllTeacherIDs, checkTeacherID } = require("./firestore-teachers");

// Check Validity of Date string or Date objects
function isValidDate(input) {
  let date;

  // Check if input is a Date object
  if (input instanceof Date) {
    date = input;
  }
  // Check if input is a string
  else if (typeof input === 'string') {
    date = new Date(input);
  } else {
    return false; // Input is neither a string nor a Date object
  }

  // Return true if the date is valid (not NaN)
  return !isNaN(date);
}

// YYYY-MM-DD format
async function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
};

// HH:MM:SS format
async function getCurrentTime() {
  const currentDate = new Date();
  return `${currentDate.getUTCHours().toString().padStart(2, '0')}:${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} UTC`;
};

// Book a Lesson
async function bookLessonForTeacher(teacherID, bookingDate, time, userEmail, tutorSubject, tutorDescription) {

  if (!checkTeacherID(teacherID)){
    console.log("Not an Authenticated Teacher");
    return;
  }

  const bookingData = {
    teacherID: teacherID,
    bookingDetails: {
      bookedBy: userEmail,
      bookingDate: await getCurrentDate(),
      bookingTime: await getCurrentTime(),
      subjectName: tutorSubject,
      lessonDescription: tutorDescription,
      isBooked: true,
    }
  };

  try {
    // Booking date reference
    const docRef = db.collection('scheduler').doc(bookingDate);

    // Document obtain
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Get the existing schedule
      const existingSchedule = docSnap.data().schedule || {};
      const bookingsAtTime = existingSchedule[time] || [];

      // Check if the teacher is already booked at the given time
      const isTeacherAlreadyBooked = bookingsAtTime.some(booking => booking.teacherID === teacherID);

      if (isTeacherAlreadyBooked) {
        console.log('Teacher is already booked at this time.');
        return; // Exit if the teacher is already booked at the given time
      }

      // Add the new booking to the array
      bookingsAtTime.push(bookingData);

      // Update the schedule with the new array of bookings
      await docRef.set({
        schedule: {
          [time]: bookingsAtTime
        }
      }, { merge: true });

    } else {
      // Create a new document if it doesn't exist
      await docRef.set({
        schedule: {
          [time]: [bookingData] // Array Initialisation
        }
      });
    }
    console.log("Booking added successfully for teacher:", teacherID);

  } catch (error) {
    console.error("Error booking the lesson:", error);
  }
}

async function deleteBookingForTeacher(teacherID, bookingDate, time) {
  try {
    // Reference to the document using the booking date
    const docRef = db.collection('scheduler').doc(bookingDate);

    // Check if the document exists
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Get the existing schedule
      const existingSchedule = docSnap.data().schedule || {};
      const bookingsAtTime = existingSchedule[time] || [];

      // Find the index of the booking to delete
      const bookingIndex = bookingsAtTime.findIndex(booking => booking.teacherID === teacherID);

      if (bookingIndex === -1) {
        console.log('No booking found for this teacher at this time.');
        return; // Exit if no booking is found for the given teacher
      }

      // Remove the booking from the array
      bookingsAtTime.splice(bookingIndex, 1);

      // Update the schedule with the modified array
      await docRef.set({
        schedule: {
          [time]: bookingsAtTime.length > 0 ? bookingsAtTime : admin.firestore.FieldValue.delete() // Delete the time slot if empty
        }
      }, { merge: true });

      console.log(`Booking for teacher ID ${teacherID} deleted successfully for date ${bookingDate} at time ${time}.`);

    } else {
      console.log('No bookings found for the specified date.');
    }

  } catch (error) {
    console.error("Error deleting the booking:", error);
  }
}

function getFullyBookedTimes(teachers, bookings) {
  const fullyBookedTimes = new Set(); // To store times when all teachers are booked

  // Extract unique times from bookings
  const uniqueTimes = [...new Set(bookings.map(booking => booking.time))];

  // Check each time to see if all teachers are booked
  for (const time of uniqueTimes) {
      const allBooked = teachers.every(teacherID => {
          const booking = bookings.find(b => b.teacherID === teacherID && b.time === time);
          return booking && booking.isBooked; // Check if booking exists and is booked
      });

      if (allBooked) {
          fullyBookedTimes.add(time); // Add to the set of fully booked times
      }
  }

  return [...fullyBookedTimes]; // Convert Set back to array
}

async function checkTimeSlotsFromDate(dateSelected) {
  try {
    const teacherIDs = await getAllTeacherIDs();
    const teacherBookedSlots = [];
    const docRef = db.collection('scheduler').doc(dateSelected);
    const docSnap = await docRef.get();

    if (isValidDate(dateSelected)) {
      console.log("Correct date");

      if (docSnap.exists) {
        const existingSchedule = docSnap.data()?.schedule || {};

        // If there's no schedule, handle the empty case
        if (Object.keys(existingSchedule).length === 0) {
          console.log("No schedule found for the selected date.");
          return generateRemainingTimes([]); // Pass an empty array
        }

        // Process the existing schedule
        Object.entries(existingSchedule).forEach(([time, teachers]) => {
          teachers.forEach((teacher) => {
            teacherBookedSlots.push({
              time,
              teacherID: teacher.teacherID,
              isBooked: teacher.bookingDetails.isBooked,
            });
          });
        });

        console.log("Teacher Booked Slots:", teacherBookedSlots);
        const fullyBookedTimes = getFullyBookedTimes(teacherIDs, teacherBookedSlots);
        console.log("Fully Booked Times:", fullyBookedTimes);

        // Call the function with fullyBookedTimes
        return generateRemainingTimes(fullyBookedTimes);

      } else {
        console.log("No schedule found for the selected date.");
        return generateRemainingTimes([]); // Pass an empty array here as well
      }
    } else {
      console.log("Not a Valid Date Entered");
    }
  } catch (error) {
    console.log("Error Located: " + error);
  }
}

// Assuming generateRemainingTimes looks something like this
function generateRemainingTimes(providedTimes = [], startTime = '8:00 AM', endTime = '8:00 PM') {
  const times = [];

  // Helper function to convert 12-hour time to a Date object
  function convertTo24Hour(timeStr) {
      let [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      minutes = minutes || '00';  // Default to '00' minutes if not provided
      
      if (hours === '12') {
          hours = '00';  // Handle 12 AM case
      }

      if (modifier === 'PM' && hours !== '12') {
          hours = parseInt(hours, 10) + 12;  // Convert PM to 24-hour format
      }

      return new Date(1970, 0, 1, hours, minutes);
  }

  // Helper function to format a date object to 12-hour AM/PM time
  function formatTo12Hour(date) {
      return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
      });
  }

  // Parse the start and end times
  let currentTime = convertTo24Hour(startTime);
  const endTimeDate = convertTo24Hour(endTime);

  // Ensure provided times are in consistent format ('12:00 PM')
  const providedTimesSet = new Set(providedTimes.map(time => time.toUpperCase()));

  // Loop through the time range
  while (currentTime <= endTimeDate) {
      const formattedTime = formatTo12Hour(currentTime);

      if (!providedTimesSet.has(formattedTime.toUpperCase())) {
          times.push(formattedTime);  // Add time if it's not fully booked
      }

      currentTime.setHours(currentTime.getHours() + 1);  // Increment by one hour
  }

  return times;
}


async function checkWhosAvailableAtTime(dateSelected, timeSelected) {
  try {
      const teacherIDs = await getAllTeacherIDs(); // Fetch all teacher IDs
      const teacherAvailableIDs = []; // Initialize an array for available teachers

      const docRef = db.collection('scheduler').doc(dateSelected);
      const docSnap = await docRef.get();

      if (isValidDate(dateSelected)) {
          if (docSnap.exists) {
              const existingSchedule = docSnap.data().schedule || {};

              // Initialize a Set to track booked teachers
              const bookedTeachersSet = new Set();

              // Check if the specified time exists in the schedule
              if (existingSchedule[timeSelected]) {
                  // Loop through the teachers booked at the selected time
                  existingSchedule[timeSelected].forEach(teacher => {
                      if (teacher.bookingDetails.isBooked) {
                          bookedTeachersSet.add(teacher.teacherID); // Track booked teachers
                      }
                  });
              }

              // Determine available teachers
              teacherIDs.forEach(teacherID => {
                  // If the teacher is not in the booked set, they are available
                  if (!bookedTeachersSet.has(teacherID)) {
                      teacherAvailableIDs.push({
                          teacherID: teacherID,
                          isBooked: false // They are available
                      });
                  }
              });

              // Return the list of available teachers

              console.log(teacherAvailableIDs);
              return teacherAvailableIDs;
          } else {
              console.log("Error: No Document Reference");
              return [];
          }
      } else {
          console.log("Error: Date is Not Valid");
          return [];
      }
  } catch (error) {
      console.log("Error: ", error);
      return [];
  }
}



// bookLessonForTeacher(
//   15, 
//   "2024-09-21", 
//   "10:00 AM", 
//   "user@example.com", 
//   "Mathematics", 
//   "Looking to improve algebra skills."
// );

// deleteBookingForTeacher("7", "2024-09-21", "10:00 AM")
// bookLessonForTeacher(3, "2024-09-21", "10:00 AM", "pretend3@gmail.com", "biology", "description example");
// checkWhosAvailableAtTime("2024-09-21", "11:00 AM");
// checkTimeSlotsFromDate("2024-09-24");

module.exports = {
  bookLessonForTeacher,
  deleteBookingForTeacher,
  getCurrentTime,
  getCurrentDate,
  checkTimeSlotsFromDate,
  checkWhosAvailableAtTime,
};