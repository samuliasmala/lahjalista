import axios from "axios";
const baseURL = "http://localhost:3001/gifts";


async function getAll() {
    return await axios.get(baseURL)
}

async function getOne(id: string) {
    return (await axios.get(`${baseURL}/${id}`)).data
}

async function create(newObject: object) {
    return (await axios.post(baseURL, newObject)).data
}

async function update(id: string, newObject: object) {
    return (await axios.put(`${baseURL}/${id}`, newObject)).data
}


const exportableModules = { getAll, getOne, create, update }

export default exportableModules