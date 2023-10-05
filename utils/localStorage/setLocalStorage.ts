/**
 *
 * @param key a value that is used as a key in localStorage
 * @param value data that is wanted to be saved
 */
export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}
