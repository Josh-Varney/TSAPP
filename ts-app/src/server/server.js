const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../firebase/firebase-service'); // Make sure this path is correct
const { checkTimeSlotsFromDate } = require('../firebase/firestore-scheduler'); // Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Corrected to invoke json() middleware

// API endpoint to fetch available times
app.get('/api/getAvailableTimes', async (req, res) => {
    try {
        const timesAvailable = await checkTimeSlotsFromDate("2024-09-21"); // Replace with dynamic date if needed
        res.json(timesAvailable);
    } catch (error) {
        console.error('Error fetching available times:', error);
        res.status(500).send('Error fetching available times');
    }
});

// API endpoint to get all available teachers at selected time (not yet implemented)
app.get('/api/getAllAvailableTeachersAtTimeSelected', async (req, res) => {
    try {
        // Logic to fetch available teachers will go here
        res.status(200).send("This endpoint is not yet implemented.");
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Error fetching teachers');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
