import { isWindow } from '../isWindow';

/**
 *
 * @returns a string that contains individual ID.
 *
 * Example return: 0a776b46-ec73-440c-a34d-79a2b23cada0
 */
export function generateUUID(): string {
  isWindow();
  return crypto.randomUUID();
}
