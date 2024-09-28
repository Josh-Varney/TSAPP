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
