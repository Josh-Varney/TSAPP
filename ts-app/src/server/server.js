import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db } from '../firebase/firebase.js';
import { checkTimeSlotsFromDate, checkWhosAvailableAtTime, obtainFullyBookedTimes } from '../firebase/firestore-scheduler.js'; 
import { checkTeacherID, getAllTeacherIDs, obtainTeacherProfile } from '../firebase/firestore-teachers.js';
import { checkAllTeacherAvailability, findFullyBookedSlots } from '../firebase/firestore-availability.js';

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
        // Fetch both bookedSlots and availableSlots from your function
        const { bookedSlots, availableSlots } = await findFullyBookedSlots(date);
        
        // Return both values in the response as an object
        res.json({
            bookedSlots,     // Booked slots for the day
            availableSlots   // Available slots for the day
        });

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
        const teacherIDs = await getAllTeacherIDs();
        const teachersAvailable = await checkAllTeacherAvailability(teacherIDs, dateSelected, timeSelected);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
