import { isWindow } from '../isWindow';

/**
 *
 * @returns an array of objects that had key starting as gift_
 */
export function getFullGiftsLocalStorage() {
  isWindow();

  let array: any = [];
  for (let [key, values] of Object.entries(localStorage)) {
    if (key.startsWith('gift_')) {
      values = JSON.parse(values);
      array = array.concat({
        name: values['name'],
        gift: values['gift'],
        keyID: values['keyID'],
      });
    }
  }
  return array;
}
