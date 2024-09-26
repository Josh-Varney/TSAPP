// firebase.test.js
const { bookLessonForTeacher, deleteBookingForTeacher, getCurrentDate, getCurrentTime } = require('../src/firebase/firestore-scheduler');
const { removeLesson, logActivity, updateLessonFeedback, getLessonActivity } = require('../src/firebase/firestore-activity');
const { findTeacherID, obtainTeacherProfile } = require('../src/firebase/firestore-teachers');
const { expect } = require('chai');

