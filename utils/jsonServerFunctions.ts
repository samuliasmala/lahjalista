import axios from 'axios';
import { Gifts } from '~/pages';

const baseURL = 'http://localhost:3001/gifts';

export async function getAll() {
  return ((await axios.get(baseURL)).data) as Gifts[];
}

/**
 *
 * @param id should be given a string that contains the id that is wanted to be searched.
 * @returns an array of JavaScript objects if found. Else an empty array
 */
export async function getOne(id: string) {
  return ((await axios.get(`${baseURL}?id=${id}`)).data) as Gifts[];
}

export async function create(newObject: object) {
  return (await axios.post(baseURL, newObject)).data;
}

/**
 *
 * @param id should be given a string that contains search parameters as query strings.
 * @param newObject a new object of Gifts that will be replacing the old object
 * @returns an array of JavaScript objects after the update
 */
export async function update(id: string, newObject: Gifts[]) {
  return (await axios.put(`${baseURL}?${id}`, newObject)).data;
}

/**
 *
 * @param id should be given the id that is wanted to be removed
 * @returns
 */
export async function remove(id: string) {
  return (await axios.delete(`${baseURL}/${id}`)).data;
}