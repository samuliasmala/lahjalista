import axios from "axios";
const baseURL: string = "http://localhost:3001/1";


async function getAll(){
    const fetchRequest = axios.get(baseURL)
    const data = await fetchRequest
    return data
}







const exportObject = {
    getAll
}


export default { getAll }