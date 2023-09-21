import { isWindow } from './isWindow';

/**
 *
 * @returns an individual ID with randomUUID. The individual ID looks like: gift_number-array*
 *
 * number-array* = crypto.randomUUID()
 *
 * return example: gift_150cd819-1502-4717-9c96-f7ca7b42d8bd
 */
export function generateGiftID(): string {
  isWindow();
  return `gift_${crypto.randomUUID()}`;
}
