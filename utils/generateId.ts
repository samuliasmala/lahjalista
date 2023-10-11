/**
 *
 * @returns an individual ID with randomUUID. The individual ID looks like: gift_number-array*
 *
 * number-array* = crypto.randomUUID()
 *
 * return example: gift_150cd819-1502-4717-9c96-f7ca7b42d8bd
 */
export function generateGiftID(): string {
  return `gift_${crypto.randomUUID()}`;
}

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
  if (typeof UUID !== 'undefined') return `${frontID}_${UUID}`;

  return `${frontID}_${crypto.randomUUID()}`;
}
