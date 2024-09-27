import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db } from '../firebase/firebase.js';
import { checkTimeSlotsFromDate, checkWhosAvailableAtTime } from '../firebase/firestore-scheduler.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

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

// API endpoint to get all available teachers at selected time (not yet implemented)
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

// API endpoint to book a lesson with a teacher (not yet implemented)
app.get('/api/bookLessonWithTeacher', async (req, res) => {
    return res.status(400).send("Has not been developed yet");
});

// API endpoint to handle cancellation with a teacher (not yet implemented)
app.get('/api/cancellationWithTeacher', async (req, res) => {
    return res.status(400).send("Has not been developed yet");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
