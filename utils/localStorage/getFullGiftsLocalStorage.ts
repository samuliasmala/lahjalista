import { FullLocalStorage } from "~/pages";
import { isWindow } from '../isWindow';

/**
 *
 * @returns an array of objects that had key starting as gift_
 */
export function getFullGiftsLocalStorage() {
  isWindow();

  let array: FullLocalStorage[] = [];
  for (const [key, values] of Object.entries(localStorage)) {
    if (key.startsWith('gift_')) {
      const JSON_Values = JSON.parse(values);
      array = array.concat({
        name: JSON_Values['name'],
        gift: JSON_Values['gift'],
        id: JSON_Values['id'],
        localStorageKeyID: JSON_Values['localStorageKeyID'],
        createdDate: JSON_Values['createdDate'],
      });
    }
  }
  return array;
}
