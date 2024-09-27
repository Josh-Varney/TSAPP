const { FieldValue } = require('firebase-admin').firestore;
const { db } = require("./firebase");

// Function to remove a specific lesson for a user by email, bookingDate, and bookingTime
async function removeLesson(userEmail, bookingDate, bookingTime) {
    try {
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const lessons = docSnap.data().lessons;

            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log(`Removing lesson on ${bookingDate} at ${bookingTime}.`);

                await docRef.update({
                    [`lessons.${bookingDate}.${bookingTime}`]: FieldValue.delete()
                });

                // If no other lessons remain for the date, remove the entire date entry
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

// Function to log activity into Firestore
async function logActivity(teacherID, userEmail, bookingDate, bookingTime, bookingLength, tutorSubject, tutorDescription) {
    try {
        const activityData = {
            teacherID: teacherID,
            lessonSummary: {
                bookingTime: bookingTime,
                bookingLength: bookingLength,
                bookingSubject: tutorSubject,
                bookingDescription: tutorDescription,
            },
            lessonFeedback: {
                lessonFeedback: null,
                lessonEngagementScore: null,
            },
            lessonOccurred: null
        };

        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const lessons = docSnap.data().lessons;

            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log(`Error: A lesson is already booked on ${bookingDate} at ${bookingTime}.`);
                return;
            }

            console.log("No conflicting lesson. Adding or updating lesson.");
            await docRef.update({
                [`lessons.${bookingDate}.${bookingTime}`]: activityData
            });
        } else {
            console.log("Document does not exist. Creating a new one.");
            await docRef.set({
                lessons: {
                    [bookingDate]: {
                        [bookingTime]: activityData
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error logging activity: ", error);
    }
}

// New function to update lesson feedback and mark if the lesson occurred
async function updateLessonFeedback(userEmail, bookingDate, bookingTime, lessonFeedback, lessonEngagementScore, lessonOccurred) {
    try {
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const lessons = docSnap.data().lessons;

            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log("Lesson found. Updating feedback and status.");

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

// Function to get lesson activity for a user
async function getLessonActivity(userEmail) {
    try {
        const docRef = db.collection('activity').doc(userEmail);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
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

// Export the functions
module.exports = {
    removeLesson,
    logActivity,
    updateLessonFeedback,
    getLessonActivity,
};
