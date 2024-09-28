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

    // Round up to the next half-hour if the current time is not exactly on the hour or half-hour
    const currentMinutes = currentTime.getMinutes();
    if (currentMinutes > 0 && currentMinutes <= 30) {
        currentTime.setMinutes(30); // Round to the next half-hour if minutes are between 1 and 30
    } else if (currentMinutes > 30) {
        currentTime.setHours(currentTime.getHours() + 1); // Increment hour
        currentTime.setMinutes(0); // Set minutes to 00
    }

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

export function getTime() {
    // Get current time
    let now = new Date();

    // Get current minutes and hours
    let currentMinutes = now.getMinutes();
    let currentHour = now.getHours();

    // Determine AM or PM
    let ampm = currentHour < 12 ? "AM" : "PM";
    let currentHourDisplay = currentHour % 12 || 12; // Convert 0 to 12 for midnight/noon

    // Format minutes to always be two digits
    let formattedMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;

    // Format the string
    let currentTimeString = `${currentHourDisplay}:${formattedMinutes} ${ampm}`;
    return currentTimeString;
}

export function isValidTime(timeString) {
    const regex = /^(0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/; // Matches hh:mm AM/PM format
    return regex.test(timeString);
}