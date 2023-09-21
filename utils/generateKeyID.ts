import { isWindow } from './isWindow';

/**
 *
 * @returns a string that contains individual ID for key in React component.
 */
export function generateKeyID(): string {
  isWindow();
  return crypto.randomUUID();
}
