/**
 *
 * @param key a string that contains the keyID that is wanted to be deleted
 *
 * @returns nothing
 */
export function removeLocalStorage(key: string) {
  return window.localStorage.removeItem(key);
}
