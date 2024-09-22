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

// Example usage
const teacherName = "John Doe";
const bookingDate = "2024-09-21"; // Format: YYYY-MM-DD
const time = "12:00 AM";
const userEmail = "student@example.com";
const tutorSubject = "Mathematics";
const tutorDescription = "Algebra basics and equations";

bookLessonForTeacher(teacherName, bookingDate, time, userEmail, tutorSubject, tutorDescription);
