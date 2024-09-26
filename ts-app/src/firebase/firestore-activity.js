const { FieldValue } = require('firebase-admin').firestore;
const { db } = require("./firebase-service");

// Function to remove a specific lesson for a user by email, bookingDate, and bookingTime
async function removeLesson(userEmail, bookingDate, bookingTime) {
    try {
        // Reference to the user's document in the 'activity' collection
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const lessons = docSnap.data().lessons;

            // Check if the lesson exists for the given date and time
            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log(`Removing lesson on ${bookingDate} at ${bookingTime}.`);

                // Use Firestore's FieldValue.delete() to remove the specific lesson
                await docRef.update({
                    [`lessons.${bookingDate}.${bookingTime}`]: FieldValue.delete()
                });

                // Check if this was the only lesson on that date, and if so, remove the date entry as well
                const updatedDoc = await docRef.get();
                const updatedLessons = updatedDoc.data().lessons;
                if (Object.keys(updatedLessons[bookingDate]).length === 0) {
                    await docRef.update({
                        [`lessons.${bookingDate}`]: FieldValue.delete()
                    });
                }

                console.log("Lesson removed successfully.");
            } else {
                console.log("Error: No lesson found on this date and time.");
            }
        } else {
            console.log("Error: No document found for this user.");
        }
    } catch (error) {
        console.error("Error removing lesson: ", error);
    }
}

// removeLesson("shush@gmail.com", "2022-02-01", "9:00 AM");

// Function to log activity into Firestore
async function logActivity(teacherID, userEmail, bookingDate, bookingTime, bookingLength, tutorSubject, tutorDescription) {
    try {
        // Construct activity data object
        const activityData = {
            teacherID: teacherID,
            lessonSummary: {
                bookingTime: bookingTime,
                bookingLength : bookingLength,
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
            // Get the lessons data from the document
            const lessons = docSnap.data().lessons;

            // Check if a lesson already exists for the same date and time
            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                // If a lesson exists for the same time, throw an error or return a message
                console.log(`Error: A lesson is already booked on ${bookingDate} at ${bookingTime}.`);
                return;
            }

            // Add or update the lesson if no conflict exists
            console.log("No conflicting lesson. Adding or updating lesson.");
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
// logActivity("4", "shush@gmail.com", "2022-02-01", "9:00 AM", "Biology", "Stinky");

// New function to update lesson feedback and mark if the lesson occurred
async function updateLessonFeedback(userEmail, bookingDate, bookingTime, lessonFeedback, lessonEngagementScore, lessonOccurred) {
    try {
        // Reference to the user's document in 'activity' collection
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const lessons = docSnap.data().lessons;

            // Check if the lesson exists for the given date and time
            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log("Lesson found. Updating feedback and status.");

                // Update only the lessonFeedback and lessonOccurred fields
                await docRef.update({
                    [`lessons.${bookingDate}.${bookingTime}.lessonFeedback.lessonFeedback`]: lessonFeedback,
                    [`lessons.${bookingDate}.${bookingTime}.lessonFeedback.lessonEngagementScore`]: lessonEngagementScore,
                    [`lessons.${bookingDate}.${bookingTime}.lessonOccurred`]: lessonOccurred
                });

                console.log("Lesson feedback and status updated successfully.");
            } else {
                console.log("Error: No lesson found on this date and time.");
            }
        } else {
            console.log("Error: No document found for this user.");
        }
    } catch (error) {
        console.error("Error updating lesson feedback: ", error);
    }
}

// Use of Above Function
// updateLessonFeedback("shush@gmail.com", "2022-02-01", "9:00 AM", "Great session", 5, true);

// async function () {
//     // Add logic for deleting feedback
// }

async function getLessonActivity(userEmail) {
    try {
        // Reference to the user's document in 'activity' collection
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            // Retrieve the lessons data from the document
            const lessons = docSnap.data().lessons;
            
            if (lessons) {
                console.log("Lessons found:", lessons);
                return lessons;  // Return the lessons object
            } else {
                console.log("No lessons found for this user.");
                return null;
            }
        } else {
            console.log("No document found for this user.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving lesson activity: ", error);
        return null;
    }
}

// getLessonActivity("shush@gmail.com").then(lessons => {
//     if (lessons) {
//         console.log("All lessons:", lessons);
//     }
// });

module.exports = {
    removeLesson,
    logActivity,
    updateLessonFeedback,
    getLessonActivity,
};
