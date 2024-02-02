import axios from 'axios';
import { Gift } from '~/pages';

const baseURL = '/api/gifts';

/**
 *
 * @returns an array that contains all the gifts as objects
 */
export async function getAllGifts() {
  return (await axios.get(baseURL)).data;
}

/**
 *
 * @param id should be given a string that contains the id that is wanted to be searched.
 * @returns an object of a gift if it was found. Else it will return null
 */
export async function getGift(id: string) {
  return await axios.get(`${baseURL}/?id=${id}`);
}

/**
 *
 * @param newObject a new object of a gift that will added to the server
 */
export async function createGift(newObject: Gift) {
  await axios.post(baseURL, newObject);
}

/**
 *
 * @param id should be given a string that contains the id of the gift that is wanted to be updated
 * @param newObject a new object of Gifts that will be replacing the old object
 */
export async function updateGift(id: string, newObject: Partial<Gift>) {
  await axios.patch(`${baseURL}/${id}`, newObject);
}

/**
 *
 * @param id should be given the id that is wanted to be deleted
 */
export async function deleteGift(id: string) {
  await axios.delete(`${baseURL}/?id=${id}`);
}
