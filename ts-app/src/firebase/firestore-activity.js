import { db } from "./firebase.js"; // Adjust the import as necessary
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Import necessary Firestore functions

// Function to log activity into Firestore
export async function logActivity(teacherID, userEmail, bookingDate, bookingTime, bookingLength, tutorSubject, tutorDescription) {
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

        const docRef = doc(db, 'activity', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const lessons = docSnap.data().lessons;

            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log(`Error: A lesson is already booked on ${bookingDate} at ${bookingTime}.`);
                return;
            }

            console.log("No conflicting lesson. Adding or updating lesson.");
            await updateDoc(docRef, {
                [`lessons.${bookingDate}.${bookingTime}`]: activityData
            });
        } else {
            console.log("Document does not exist. Creating a new one.");
            await setDoc(docRef, {
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
export async function updateLessonFeedback(userEmail, bookingDate, bookingTime, lessonFeedback, lessonEngagementScore, lessonOccurred) {
    try {
        const docRef = doc(db, 'activity', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const lessons = docSnap.data().lessons;

            if (lessons && lessons[bookingDate] && lessons[bookingDate][bookingTime]) {
                console.log("Lesson found. Updating feedback and status.");

                await updateDoc(docRef, {
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
export async function getLessonActivity(userEmail) {
    try {
        const docRef = doc(db, 'activity', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
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
