const { db } = require("./firebase");

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function checkTeacherID(teacherID) {
    const querySnapshot = await db.collection('teachers').get();
    
    for (const doc of querySnapshot.docs) {
        const docData = doc.data();
        if (docData.teacherID === teacherID) {
            return true;
        }
    }
    return false;
}

async function obtainTeacherProfile(teacherID) {
    try {
        const querySnapshot = await db.collection('teachers').get();
        let teacherDoc = null;

        for (const doc of querySnapshot.docs) {
            const docData = doc.data();
            if (docData.teacherID === teacherID) {
                console.log('Document found:', doc.id, docData);
                teacherDoc = docData;
                break;
            }
        }

        if (teacherDoc) {
            console.log("Returning Document");
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

async function getAllTeacherIDs() {
    try {
        const querySnapshot = await db.collection('teachers').get();
        return querySnapshot.docs.map(doc => doc.data().teacherID);
    } catch (error) {
        console.error("Error fetching teacher IDs:", error);
        return null;
    }
}

async function addTeacherProfile(dbsValidation, firstName, lastName, teacherEmail, teacherID) {
    try {
        if (!isValidEmail(teacherEmail)) {
            throw new Error("Invalid email format");
        }

        const existingDoc = await db.collection('teachers').doc(teacherEmail).get();
        if (existingDoc.exists) {
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

        await db.collection('teachers').doc(teacherEmail).set(teacherData);
        console.log("Teacher added with email as ID: ", teacherEmail);
    } catch (error) {
        console.error("Error adding teacher profile:", error.message);
    }
}

async function deleteTeacherProfile(teacherEmail) {
    try {
        if (!isValidEmail(teacherEmail)) {
            throw new Error("Invalid email format");
        }

        const docRef = db.collection('teachers').doc(teacherEmail);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("No teacher found with the provided email.");
        }

        await docRef.delete();
        console.log("Teacher removed successfully.");
    } catch (error) {
        console.error("Error deleting teacher profile:", error.message);
    }
}

// Example usage:
// addTeacherProfile(true, "Josh", "Doe", "user1@example.com", 1);

module.exports = {
    checkTeacherID,
    obtainTeacherProfile,
    getAllTeacherIDs,
};
