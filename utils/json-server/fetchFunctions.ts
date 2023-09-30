import axios from "axios";
const baseURL: string = "http://localhost:3001/gifts";


async function getAll(){
    const fetchRequest = axios.get(baseURL)
    const data = await fetchRequest
    return data
}







const exportObject = {
    getAll
}


export default { getAll }