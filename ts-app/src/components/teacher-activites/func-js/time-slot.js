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



