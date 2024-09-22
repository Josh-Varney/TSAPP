const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Get Firestore instance
const db = admin.firestore();

// Mock function to retrieve teacher's name asynchronously
async function findTeacherName(teacherID) {
    return "John Cena";  // Replace with actual logic if necessary
}

// Function to log activity into Firestore
async function logActivity(teacherID, userEmail, bookingDate, bookingTime, tutorSubject, tutorDescription) {
    try {
        // Await the teacher's name since it's an asynchronous function
        const teacherName = await findTeacherName(teacherID);

        // Construct activity data object
        const activityData = {
            teacherName: teacherName,
            lessonSummary: {
                bookingTime: bookingTime,
                bookingSubject: tutorSubject,
                bookingDescription: tutorDescription,
            },
            lessonFeedback: {
                lessonFeedback: null,
                lessonEngagementScore: null,
            },
            lessonOccurred: null
        };

        // Reference to the user's document in 'activity' collection
        const docRef = db.collection('activity').doc(userEmail);

        // Fetch the document snapshot
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            // Update document if it already exists
            console.log("Document exists. Adding or updating lesson.");
            
            // Use a combination of bookingDate and bookingTime to uniquely store lessons
            await docRef.update({
                [`lessons.${bookingDate}.${bookingTime}`]: activityData
            });
        } else {
            // Create a new document if it doesn't exist
            console.log("Document does not exist. Creating a new one.");
            await docRef.set({
                lessons: {
                    [bookingDate]: {
                        [bookingTime]: activityData  // Initialize with the current lesson data
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error logging activity: ", error);
    }
}

// Example usage of the logActivity function
logActivity("4", "shush@gmail.com", "2022-02-01", "9:00 AM", "Biology", "Stinky");
logActivity("4", "shush@gmail.com", "2022-02-01", "11:00 AM", "Math", "Algebra");
logActivity("4", "shush@gmail.com", "2022-02-02", "2:00 PM", "Physics", "Kinematics");

// Placeholder functions for additional functionality
async function logLessonFeedback() {
    // Add logic for logging feedback
}

async function deleteLessonFeedback() {
    // Add logic for deleting feedback
}

async function getLessonActivity() {
    // Add logic for retrieving lesson activity
}
