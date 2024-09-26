const { db } = require("./firebase-service");
const fs = require('fs'); // Use require instead of import
const e = require('express');

async function checkTeacherID(teacherID) {
    const querySnapshot = await db.collection('teachers').get();

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        
        if (docData.teacherID === teacherID) { // Assuming staffEmail holds the email in JSON
            return true;
        }
    });
    return false;
}

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

async function getAllTeacherIDs(){
    try {
        const querySnapshot = await db.collection('teachers').get();

        if (querySnapshot){
            const teacherIDs = querySnapshot.docs.map(doc => doc.data().teacherID);
            return teacherIDs;
        } else {
            console.log("Error: Teachers QuerySnapshot cannot be found");
        }
    } catch (error){
        console.log("Error: " + error);
    }
}

async function addTeacherProfile(dbsValidation, firstName, lastName, teacherEmail, teacherID) {
    try {
        // Validate email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(teacherEmail)) {
            throw new Error("Invalid email format");
        }

        // Check if the email already exists in the database
        const querySnapshot = await db.collection('teachers')
            .where('teacherEmail', '==', teacherEmail)
            .get();

        if (!querySnapshot.empty) {
            throw new Error("Email already exists in the database");
        }

        // Prepare teacher data
        const teacherData = {
            dbs_check_valid: dbsValidation,
            firstName: firstName,
            lastName: lastName,
            teacherEmail: teacherEmail,
            teacherID: teacherID,
        };

        // Add teacher to the 'teachers' collection
        const docRef = await db.collection('teachers').add(teacherData);

        // Log the added document ID
        console.log("Teacher added with ID: ", docRef.id);

    } catch (error) {
        console.log("Error: " + error.message);
    }
}

addTeacherProfile(true, "Jane", "Doe", "jane.doe@example.com", "teacher_12345");


module.exports = {
    findTeacherID,
    checkTeacherID,
    obtainTeacherProfile,
    getAllTeacherIDs,
};