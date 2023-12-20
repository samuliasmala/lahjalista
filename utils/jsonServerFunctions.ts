import axios from 'axios';

const baseURL = 'http://localhost:3001/gifts';

async function getAll() {
  return await axios.get(baseURL);
}

/**
 *
 * @param searchParameters should be given a string that contains search parameters as query strings.
 * @example name=Foo&gift=Bar
 * @returns an array of JavaScript objects if found. Else an empty array
 */
async function getOne(searchParameters: string) {
  return (await axios.get(`${baseURL}?${searchParameters}`)).data;
}

async function create(newObject: object) {
  return (await axios.post(baseURL, newObject)).data;
}

/**
 *
 * @param id should be given the id that is wanted to be updated
 * @param newObject a new object that will be replacing the old object
 * @returns an array of JavaScript objects after the update
 */
async function update(id: string, newObject: object) {
  return (await axios.put(`${baseURL}/${id}`, newObject)).data;
}

/**
 *
 * @param id should be given the id that is wanted to be removed
 * @returns
 */
async function remove(id: string) {
  return (await axios.delete(`${baseURL}/${id}`)).data;
}

export const jsonServerFunctions = { getAll, getOne, create, update, remove };
