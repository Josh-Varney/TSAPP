import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db } from '../firebase/firebase.js';
import { checkTimeSlotsFromDate, checkWhosAvailableAtTime, obtainFullyBookedTimes } from '../firebase/firestore-scheduler.js'; 
import { checkTeacherID, obtainTeacherProfile } from '../firebase/firestore-teachers.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Corrected to invoke json() middleware

// API endpoint to fetch available times
app.get('/api/getAvailableTimes', async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).send('Date is required');
    }
    try {
        const timesAvailable = await checkTimeSlotsFromDate(date);
        res.json(timesAvailable);
    } catch (error) {
        console.error('Error fetching available times:', error);
        res.status(500).send('Error fetching available times');
    }
});

// CHANGE
app.get('/api/getAllAvailableTeachersAtTimeSelected', async (req, res) => {
    const { dateSelected, timeSelected } = req.query;
    if (!dateSelected || !timeSelected) {
        return res.status(400).send("Date and time are required");
    }
    try {
        // Logic to fetch available teachers will go here
        const teachersAvailable = await checkWhosAvailableAtTime(dateSelected, timeSelected);
        res.json(teachersAvailable);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Error fetching teachers');
    }
});

app.get('/api/getTeacherProfile', async (req, res) => {
    const teacherID = Number(req.query.teacherID)

    console.log(teacherID);

    if (!teacherID || isNaN(teacherID)) {
        return res.status(400).json({ error: 'Invalid or missing TeacherID (Number) is required' });
    }

    try {
        const validTeacher = await checkTeacherID(teacherID);
        if (validTeacher) {
            const teacherProfile = await obtainTeacherProfile(teacherID);
            return res.json(teacherProfile);
        } else {
            return res.status(404).json({ error: 'TeacherID is invalid or not active' });
        }
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CHANGE
app.get('/api/getFullyBookedTimes', async (req, res) => {
    const { dateSelected } = req.query;

    if (!dateSelected) {
        return res.status(400).send('Date is required');
    }
    try {
        const fullyBookedTimes = await obtainFullyBookedTimes(dateSelected);
        res.json(fullyBookedTimes);
    } catch (error) {
        console.error('Error fetching available times:', error);
        res.status(500).send('Error fetching available times');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
