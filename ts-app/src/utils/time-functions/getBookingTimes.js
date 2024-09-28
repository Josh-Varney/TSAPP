export function generateRemainingTimes(providedTimes = [], startTime = '8:00 AM', endTime = '8:00 PM') {
    const times = [];
    
    // Convert 12-hour time format to 24-hour format as a Date object
    const convertTo24Hour = timeStr => {
        let [time, modifier] = timeStr.trim().split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier.toUpperCase() === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        return new Date(1970, 0, 1, hours, minutes);
    };

    // Format Date object to 12-hour time string
    const formatTo12Hour = date => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Define the allowed time range
    const allowedStartTime = convertTo24Hour('8:00 AM');
    const allowedEndTime = convertTo24Hour('8:00 PM');

    // Convert provided start and end times to Date objects
    let currentTime = convertTo24Hour(startTime);
    const endTimeDate = convertTo24Hour(endTime);

    // Validate that the startTime and endTime are within the allowed range
    if (currentTime < allowedStartTime || currentTime > allowedEndTime || endTimeDate > allowedEndTime) {
        return [];
    }

    // Convert provided times to uppercase set
    const providedTimesSet = new Set(providedTimes.map(time => time.toUpperCase()));

    // Loop through the time slots, incrementing by 30 minutes (half-hour slots)
    while (currentTime <= endTimeDate) {
        const formattedTime = formatTo12Hour(currentTime);
        if (!providedTimesSet.has(formattedTime.toUpperCase())) {
            times.push(formattedTime);
        }
        currentTime.setMinutes(currentTime.getMinutes() + 30); // Increment by 30 minutes
    }

    return times;
}

// Validate the booking time is within allowed slots
function validateTimeSlot(time) {
    const allowedStartTime = convertTo24Hour('8:00 AM');
    const allowedEndTime = convertTo24Hour('8:00 PM');
    
    const convertTo24Hour = timeStr => {
        let [time, modifier] = timeStr.trim().split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier.toUpperCase() === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        return new Date(1970, 0, 1, hours, minutes);
    };

    const bookingTime = convertTo24Hour(time);

    // Ensure the time is within allowed range and is a half-hour interval
    if (bookingTime < allowedStartTime || bookingTime > allowedEndTime) {
        return false;
    }

    const minutes = bookingTime.getMinutes();
    if (minutes !== 0 && minutes !== 30) {
        return false;
    }

    return true;
}

export function getFullyBookedTimes(teachers, bookings) {
    const fullyBookedTimes = new Set();
    const uniqueTimes = [...new Set(bookings.map(booking => booking.time))];

    uniqueTimes.forEach(time => {
        const allBooked = teachers.every(teacherID => {
            const booking = bookings.find(b => b.teacherID === teacherID && b.time === time);
            return booking && booking.isBooked;
        });
        if (allBooked) fullyBookedTimes.add(time);
    });

    return [...fullyBookedTimes];
}

export async function getCurrentTime() {
    const currentDate = new Date();
    return `${currentDate.getUTCHours().toString().padStart(2, '0')}:${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} UTC`;
}