import axios from 'axios';
import { Gifts } from '~/pages';

const baseURL = 'http://localhost:3001/gifts';

export async function getAllGifts() {
  return ((await axios.get(baseURL)).data) as Gifts[];
}

/**
 *
 * @param id should be given a string that contains the id that is wanted to be searched.
 * @returns an object of a gift if it was found. Else it will return null
 */
export async function getGift(id: string) {
  const gifts = (await axios.get(`${baseURL}?id=${id}`)).data;
  if (gifts.length != 0) {
    return gifts[0]
  }
  return null
}

export async function createGift(newObject: object) {
  return (await axios.post(baseURL, newObject)).data;
}

/**
 *
 * @param id should be given a string that contains search parameters as query strings.
 * @param newObject a new object of Gifts that will be replacing the old object
 * @returns an array of JavaScript objects after the update
 */
export async function updateGift(id: string, newObject: Gifts) {
  return (await axios.put(`${baseURL}?${id}`, newObject)).data;
}

/**
 *
 * @param id should be given the id that is wanted to be removed
 * @returns an array of JavaScript objects after the deletion
 */
export async function removeGift(id: string) {
  return (await axios.delete(`${baseURL}/${id}`)).data;
}