const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs'); // Use require instead of import
const e = require('express');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function findTeacherID(teacherName) {
    // Validate and find the staff by name
    try {
        // Load the JSON file data
        const rawData = fs.readFileSync('./staff.json', 'utf8');  // Adjust the path if necessary
        const data = JSON.parse(rawData);

        // Find the teacher by name
        const staffMember = data.staff.find(staff => staff.staffName === teacherName);

        if (staffMember) {
            console.log(`Staff found:`, staffMember);
            // Query Firestore to find the matching teacher by email
            const querySnapshot = await db.collection('teachers').get();

            let teacherID = null;

            querySnapshot.forEach((doc) => {
                const docData = doc.data();

                // Compare the teacherEmail in Firestore with the staffMember's email
                if (docData.teacherEmail === staffMember.staffEmail) { // Assuming staffEmail holds the email in JSON
                    console.log('Document found:', doc.id, docData);
                    teacherID =  doc.teacherID;
                }
            });

            if (teacherID) {
                return teacherID; // Return the found email
            } else {
                console.log('No matching document found in Firestore.');
                return null;
            }

        } else {
            console.log(`Staff member with name "${teacherName}" not found.`);
            return null;  // Return null if not found
        }
    } catch (error) {
        console.error('Error reading or parsing JSON:', error);
        return null; // Return null in case of error
    }
}

// Call the function
// findTeacherID("James Vardy").then(email => {
//     if (email) {
//         console.log(`Email found: ${email}`);
//     } else {
//         console.log('Email not found.');
//     }
// });


async function obtainTeacherProfile(teacherID){
    // Obtain teacher profile
    try {
        const querySnapshot = await db.collection('teachers').get();

        let teacherDoc = null;

        querySnapshot.forEach((doc) => {
            const docData = doc.data();

            // Compare the teacherEmail in Firestore with the staffMember's email
            if (docData.teacherID === teacherID) { // Assuming staffEmail holds the email in JSON
                console.log('Document found:', doc.id, docData);
                teacherDoc = docData;
            }
        });

        if (teacherDoc){
            console.log("Returning Document");
            return teacherDoc
        } else {
            console.log("Could not find document using Teacher ID")
        }
    } catch (error){

    }
}

// obtainTeacherProfile(15);

module.exports = {
    findTeacherID,
    obtainTeacherProfile,
};