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