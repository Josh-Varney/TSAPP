
async function fetchAvailableTimes(date) {
    try {
        // Store this in an env
        const response = await fetch(`http://localhost:5000/api/getAvailableTimes?date=${date}`);

        if (!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error){
        console.log("Error Middleware: " + error);
    }
}