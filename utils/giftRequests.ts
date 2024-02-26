import axios from 'axios';
import { CreateGift } from '~/pages';
import { Gift } from '~/shared/types';

const baseURL = '/api/gifts';

/**
 *
 * @returns an array that contains all the gifts as objects
 */
export async function getAllGifts() {
  return (await axios.get(baseURL)).data as Gift[];
}

/**
 *
 * @param uuid should be given a string that contains the id that is wanted to be searched.
 * @returns an object of a gift if it was found. Else it will return null
 */
export async function getGift(uuid: string) {
  return (await axios.get(`${baseURL}/${uuid}`)).data as Gift;
}

/**
 *
 * @param newObject a new object of a gift with type Gift that will added to the server
 */
export async function createGift(newObject: CreateGift) {
  return (await axios.post(`${baseURL}`, newObject)).data as Gift;
}

/**
 *
 * @param uuid should be given a string that contains the id of the gift that is wanted to be updated
 * @param newObject should be given parts of Gift object type that are wanted to be updated
 */
export async function updateGift(uuid: string, newObject: Partial<Gift>) {
  return (await axios.patch(`${baseURL}/${uuid}`, newObject)).data as Gift;
}

/**
 *
 * @param uuid should be given the id of the gift that is wanted to be deleted
 */
export async function deleteGift(uuid: string) {
  await axios.delete(`${baseURL}/${uuid}`);
  return;
}
