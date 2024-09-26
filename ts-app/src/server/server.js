const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../firebase/firebase-service'); // Make sure this path is correct
const { checkTimeSlotsFromDate, checkWhosAvailableAtTime } = require('../firebase/firestore-scheduler'); // Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Corrected to invoke json() middleware

// API endpoint to fetch available times
app.get('/api/getAvailableTimes', async (req, res) => {
    const { date } = req.query;
    if (!date){
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
    if (!dateSelected || !timeSelected){
        return res.status(400).send("Date and teacherId are required");
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

app.get('/api/bookLessonWithTeacher', async (req, res) => {
    return res.status(400).send("Has not been developed yet");
});

app.get('api/cancellationWithTeacher', async (req, res) => {
    return res.status(400).send("Has not been developed yet");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
