export function generateRemainingTimes(providedTimes = [], startTime = '8:00 AM', endTime = '8:00 PM') {
    const times = [];
    const convertTo24Hour = timeStr => {
        let [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        return new Date(1970, 0, 1, hours, minutes);
    };
    const formatTo12Hour = date => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let currentTime = convertTo24Hour(startTime);
    const endTimeDate = convertTo24Hour(endTime);
    const providedTimesSet = new Set(providedTimes.map(time => time.toUpperCase()));

    while (currentTime <= endTimeDate) {
        const formattedTime = formatTo12Hour(currentTime);
        if (!providedTimesSet.has(formattedTime.toUpperCase())) {
            times.push(formattedTime);
        }
        currentTime.setHours(currentTime.getHours() + 1);
    }

    return times;
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