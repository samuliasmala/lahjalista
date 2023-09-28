import { isWindow } from '../isWindow';

/**
 *
 * @param frontID a string that is wanted to be before UUID.
 * @returns a random UUID or a random UUID with a frontID
 *
 * Example return with frontID: frontID_0a776b46-ec73-440c-a34d-79a2b23cada0
 *
 * Example return without frontID: 0a776b46-ec73-440c-a34d-79a2b23cada0
 */
export function generateLocalStorageID(frontID: string, UUID?: string) {
  isWindow();
  if (typeof UUID !== 'undefined') return `${frontID}_${UUID}`;

  return `${frontID}_${crypto.randomUUID()}`;
}
