// server-middle.js (or wherever you need it)
import { env } from "../next.config.js";

async function fetchData(url) {
    try {
        const response = await fetch(url);

        console.log(response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error Middleware: ", error);
        throw error; 
    }
}

export async function fetchAvailableTimes(date) {
    const url = `${env.SERVER_API}/api/getAvailableTimes?date=${date}`; 
    return fetchData(url);
}

export async function fetchAvailableTeachers(dateSelected, timeSelected) {
    const url = `${env.SERVER_API}/api/getAllAvailableTeachersAtTimeSelected?dateSelected=${dateSelected}&timeSelected=${timeSelected}`;
    return fetchData(url);
}

export async function fetchTeacherProfile(teacherID) {
    const url = `${env.SERVER_API}/api/getTeacherProfile?teacherID=${teacherID}`;
    return fetchData(url);
}


const data = await fetchTeacherProfile(3);
console.log(data);