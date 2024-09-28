export function isToday(dateString) {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
    
    // Get today's date
    const today = new Date();
    
    // Reset time to midnight for comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Check if the dates are the same
    return today.getTime() === date.getTime();
}

// This function needs to run continuously (Midnight Function)
export async function getNextThreeWeeks() {
    const slideData = [];
    const today = new Date();
    
    // Iterate through the next 21 days (3 weeks)
    for (let i = 0; i < 21; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);

        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const formattedDate = nextDate.toLocaleDateString('en-US', options).split(' ');

        slideData.push({
            day: formattedDate[0].toUpperCase(),  // Day of the week
            date: formattedDate[1],               // Day of the month
            month: formattedDate[2].toUpperCase() // Month
        });
    }

    return slideData;
};

export const getDateTimeString = (day, monthAbbr, year = new Date().getFullYear()) => {
    const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
    };

    // Convert day to a number
    day = Number(day);

    // Validate inputs
    if (isNaN(day) || day < 1 || day > 31) {
        throw new Error('Invalid day');
    }

    if (!monthMap[monthAbbr]) {
        throw new Error('Invalid month abbreviation');
    }

    const monthIndex = monthMap[monthAbbr];

    // Create a date object for the selected date using UTC to prevent timezone issues
    const selectedDate = new Date(Date.UTC(year, monthIndex, day));

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // console.log(formattedDate);

    return formattedDate;
};

export function getNextHour(){
    // Get current time
    let now = new Date();

    // Get the next hour
    let nextHour = (now.getHours() + 1) % 24; // Wrap around to 0 after 23

    // Determine AM or PM
    let ampm = nextHour < 12 ? "AM" : "PM";
    let nextHourDisplay = nextHour % 12 || 12; // Convert 0 to 12 for midnight/noon

    // Format the string
    let nextHourString = `${nextHourDisplay}:00 ${ampm}`;
    return nextHourString;
}

export function isValidDate(input) {
    const date = input instanceof Date ? input : new Date(input);
    return !isNaN(date.getTime());
}

// Helper: Get Current Date in YYYY-MM-DD format
export async function getCurrentDate() {
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
}
