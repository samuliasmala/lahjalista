/**
 *
 * @param key keyID in localStorage
 *
 * @returns a string that contains the data of specific keyID in localStorage or if not found returns a null
 */
export function getLocalStorage(key: string) {
  const item = window.localStorage.getItem(key);
  if (typeof item !== 'string') return '[]';
  return item;
}
/**
 *
 * @param key a string that contains the keyID that is wanted to be deleted
 */
export function removeLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}

/**
 *
 * @param key a value that is used as a key in localStorage
 * @param value data that is wanted to be saved
 */
export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}
