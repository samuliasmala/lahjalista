import { Gifts_Type } from '~/pages';
/**
 *
 * @param giftArray an array of objects
 * @returns an array of objects that is sorted from lowest createdDate to highest
 */

export function sortGiftsOldestFirst(giftArray: readonly Gifts_Type[]) {
  return [...giftArray].sort((a, b) => a.createdDate - b.createdDate);
}
