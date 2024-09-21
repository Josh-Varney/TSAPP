const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Google Cloud Function or AWS

// async function getTeacherDetails(teacherName){
    // Could set up a json object that links to the teachers information which then runs the correct query
// }

// async function getAvailableSlotsForTeacher(teacherId, data){

// }

// async function bookLessonForTeacher(teacherName, date, time, UserEmail, tutorSubject, tutorDescription){

// }

// async function addToOpenLesson(teacherName, date, time, UserEmail){

// }

// async function setUpOpenLesson(teacherName, date, time, UserEmail, numberOfStudents){

// }

// async function setUpLessonsEachDayForSchedule(){


// async function lessonCancellation(teacherName, date, time, UserEmail){

// }

// async function studentOpenLessonCancellation(teacherName, date, time, UserEmail){

// }