/**
 *
 * @param key keyID in localStorage
 *
 * @returns a string that contains the data of specific keyID in localStorage
 */
export function getLocalStorage(key: string) {
  return window.localStorage.getItem(key);
}
