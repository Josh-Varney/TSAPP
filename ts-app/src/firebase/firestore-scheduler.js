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

async function checkTimeSlotsFromDate(dateSelected){
  
  try {
    const teacherIDs = await getAllTeacherIDs();
    const teacherBookedSlots = [];
    const docRef = db.collection('scheduler').doc(dateSelected);
    const docSnap = await docRef.get();

    if (isValidDate(dateSelected)){
      if (docSnap.exists){
        const existingSchedule = docSnap.data().schedule || {};
        
        // Gets Teacher Booked Slot and Time
        Object.entries(existingSchedule).forEach(([time, teachers]) => {
          teachers.forEach(teacher => {
            teacherBookedSlots.push({
              time,
              teacherID: teacher.teacherID,
              isBooked: teacher.bookingDetails.isBooked
            });
          });
        });

        // To display a time, a slot can be booked unless its booked by every teacher

        console.log(teacherIDs);
        console.log(teacherBookedSlots);

      } else {
          console.log("No document Reference");
      }
    } else {
      console.log("Not a Valid Date Enterred");
    }
  } catch (error){
    console.log("Error Located: " + error);
  } 
};

bookLessonForTeacher(
  15, 
  "2024-09-21", 
  "10:00 AM", 
  "user@example.com", 
  "Mathematics", 
  "Looking to improve algebra skills."
);

// deleteBookingForTeacher("7", "2024-09-21", "10:00 AM")
// checkTimeSlotsFromDate("2024-09-21");

module.exports = {
  bookLessonForTeacher,
  deleteBookingForTeacher,
  getCurrentTime,
  getCurrentDate,
};