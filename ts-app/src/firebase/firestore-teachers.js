const { collection, getDocs, getDoc, setDoc, where, query } = require("firebase/firestore");
const { db } = require("./firebase");

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function obtainTeacherProfile(teacherID) {
    try {
        const q = query(collection(db, 'teachers'), where('teacherID', '==', teacherID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Since we expect only one result, we can return the first matched document
            const teacherDoc = querySnapshot.docs[0].data();
            console.log('Document found:', teacherDoc);
            return teacherDoc;
        } else {
            console.log("Could not find document using Teacher ID");
            return null;
        }
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        return null;
    }
}

async function addTeacherProfile(dbsValidation, firstName, lastName, teacherEmail, teacherID) {
    try {
        if (!isValidEmail(teacherEmail)) {
            throw new Error("Invalid email format");
        }
        const docRef = doc(db, 'teachers', teacherEmail);
        
        const existingDoc = await getDoc(docRef);
        if (existingDoc.exists()) {
            throw new Error("Email already exists in the database");
        }

        const teacherData = {
            dbs_check_valid: dbsValidation,
            firstName,
            lastName,
            teacherEmail,
            teacherID,
            emailValidation: false, 
        };

        await setDoc(docRef, teacherData);
        console.log("Teacher added with email as ID:", teacherEmail);
        
        return true;  // Return true to indicate success

    } catch (error) {
        console.error("Error adding teacher profile:", error.message);
        return false;  // Return false to indicate failure
    }
}

async function deleteTeacherProfile(teacherEmail) {
    try {
        if (!isValidEmail(teacherEmail)) {
            throw new Error("Invalid email format");
        }

        const docRef = doc(db, 'teachers', teacherEmail);
        const docSnap = await getDoc(docRef);

        // Check if the document exists
        if (!docSnap.exists()) {
            throw new Error("No teacher found with the provided email.");
        }

        // Delete the teacher document
        await deleteDoc(docRef);
        console.log("Teacher removed successfully.");
        return true;

    } catch (error) {
        console.error("Error deleting teacher profile:", error.message);
        return false;  
    }
}

async function getAllTeacherIDs() {
    try {
        const teachersCollection = collection(db, 'teachers');
        const querySnapshot = await getDocs(teachersCollection);
        const teacherIDs = querySnapshot.docs
            .map(doc => doc.data().teacherID)
            .filter(id => id !== undefined); 
        
        // console.log("Fetched Teacher IDs:", teacherIDs);
        return teacherIDs;
    } catch (error) {
        // Log the error and return an empty array instead of null
        console.error("Error fetching teacher IDs:", error);
        return [];
    }
}


async function checkTeacherID(teacherID) {
    try {
        const teachersCollection = collection(db, 'teachers'); 
        const querySnapshot = await getDocs(teachersCollection);
        
        console.log(`Documents retrieved: ${querySnapshot.docs.length}`);
        
        for (const doc of querySnapshot.docs) {
            const docData = doc.data();
            console.log("Document data:", docData);
            
            if (docData.teacherID === teacherID) {
                return true; 
            }
        }
        return false; 
    } catch (error) {
        console.error("Error checking teacher ID:", error);
        return null; 
    }
}

module.exports = {
    checkTeacherID,
    obtainTeacherProfile,
    getAllTeacherIDs,
};
