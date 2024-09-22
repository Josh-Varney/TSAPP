const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to get the current date in YYYY-MM-DD format
async function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Adjust for zero-based month
  const day = currentDate.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get the current time in HH:mm:ss format
async function getCurrentTime() {
  const currentDate = new Date();
  const hours = currentDate.getUTCHours().toString().padStart(2, '0');
  const minutes = currentDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds} UTC`;
}

// async function getTeacherID(teacherName){

// }

// Function to book a lesson for a teacher
async function bookLessonForTeacher(teacherName, bookingDate, time, userEmail, tutorSubject, tutorDescription) {
  const teacherID = "15"; // Placeholder for teacherID. Modify as needed

  // Construct booking data
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
    // Reference to the document using the booking date
    const docRef = db.collection('scheduler').doc(bookingDate);

    // Check if the document already exists
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
          [time]: [bookingData] // Initialize with an array
        }
      });
    }

    console.log("Booking added successfully for teacher:", teacherName);

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

// bookLessonForTeacher(teacherName, bookingDate, time, userEmail, tutorSubject, tutorDescription);
// deleteBookingForTeacher("7", "2024-09-21", "10:00 AM")
