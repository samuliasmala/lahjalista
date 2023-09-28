import { FullLocalStorage } from '~/types/types';
/**
 *
 * @param wrongOrderArray an array of objects
 * @returns an array of objects that is sorted from lowest createdDate to highest
 */

export function sortGiftsOldestFirst(wrongOrderArray: FullLocalStorage[]) {
  const numbersArray: any[] = [];
  const correctOrderArray: FullLocalStorage[] = [];
  wrongOrderArray.forEach((gift) => {
    numbersArray.push(gift.createdDate);
  });

  numbersArray.sort((a, b) => a - b);
  numbersArray.forEach((creationDate) => {
    wrongOrderArray.forEach((gift) => {
      if (gift.createdDate === creationDate) {
        correctOrderArray.push(gift);
      }
    });
  });
  return correctOrderArray;
}
