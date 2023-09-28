/**
 *
 * @returns if Window is undefined, throws an error
 */

export function isWindow() {
  if (typeof window === 'undefined')
    throw new Error(
      'Window was defined as undefined. LocalStorage could not be read.',
    );
  return true;
}
