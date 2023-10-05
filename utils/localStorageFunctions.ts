import { FullLocalStorage } from '~/pages';

/**
 *
 * @returns an array of objects that had key starting as gift_
 */
export function getFullGiftsLocalStorage() {
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

/**
 *
 * @param key keyID in localStorage
 *
 * @returns a string that contains the data of specific keyID in localStorage
 */
export function getLocalStorage(key: string) {
  return window.localStorage.getItem(key);
}
/**
 *
 * @param key a string that contains the keyID that is wanted to be deleted
 *
 * @returns nothing
 */
export function removeLocalStorage(key: string) {
  return window.localStorage.removeItem(key);
}

/**
 *
 * @param key a value that is used as a key in localStorage
 * @param value data that is wanted to be saved
 */
export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}
