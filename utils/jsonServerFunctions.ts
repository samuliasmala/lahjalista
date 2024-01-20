import axios from 'axios';
import { Gift } from '~/pages';

//const baseURL = 'http://localhost:3001/gifts'; // localhost url
const baseURL = 'https://my-json-server.typicode.com/samuliasmala/lahjalista/gifts'; // external url

/**
 *
 * @returns an array that contains all the gifts as objects
 */
export async function getAllGifts() {
  return (await axios.get(baseURL)).data as Gift[];
}

/**
 *
 * @param id should be given a string that contains the id that is wanted to be searched.
 * @returns an object of a gift if it was found. Else it will return null
 */
export async function getGift(id: string) {
  const gifts = (await axios.get(`${baseURL}?id=${id}`)).data;
  if (gifts.length != 0) {
    return gifts[0];
  }
  return null;
}

/**
 *
 * @param newObject a new object of a gift that will added to the server
 */
export async function createGift(newObject: object) {
  await axios.post(baseURL, newObject);
}

/**
 *
 * @param id should be given a string that contains search parameters as query strings.
 * @param newObject a new object of Gifts that will be replacing the old object
 */
export async function updateGift(id: string, newObject: Gift) {
  await axios.put(`${baseURL}/${id}`, newObject);
}

/**
 *
 * @param id should be given the id that is wanted to be removed
 */
export async function removeGift(id: string) {
  await axios.delete(`${baseURL}/${id}`);
}
