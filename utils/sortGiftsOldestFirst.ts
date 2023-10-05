import { FullLocalStorage } from '~/pages';
/**
 *
 * @param wrongOrderArray an array of objects
 * @returns an array of objects that is sorted from lowest createdDate to highest
 */

export function sortGiftsOldestFirst(wrongOrderArray: FullLocalStorage[]) {
  return [...wrongOrderArray].sort((a, b) => a.createdDate - b.createdDate);
}
