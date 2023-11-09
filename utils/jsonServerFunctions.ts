import axios from 'axios';

const baseURL = 'http://localhost:3001/gifts';

async function getAll() {
  return await axios.get(baseURL);
}

/**
 *
 * @param searchParamteres should be given a string that contains search paramteres as query strings.
 * @example name=Foo&gift=Bar
 * @returns an array of JavaScript objects if found. Else an empty array
 */
async function getOne(searchParamteres: string) {
  return (await axios.get(`${baseURL}?${searchParamteres}`)).data;
}

async function create(newObject: object) {
  return (await axios.post(baseURL, newObject)).data;
}

/**
 *
 * @param searchParamteres should be given a string that contains search paramteres as query strings.
 * @example name=Foo&gift=Bar
 * @param newObject a new object that will be replacing the old object
 * @returns an array of JavaScript objects after the update
 */
async function update(searchParamteres: string, newObject: object) {
  return (await axios.put(`${baseURL}?${searchParamteres}`, newObject)).data;
}

/**
 *
 * @param id should be given the id that is wanted to be removed
 * @returns
 */
async function remove(id: string) {
  return (await axios.delete(`${baseURL}/${id}`)).data;
}

const exportableModules = { getAll, getOne, create, update, remove };

export default exportableModules;
