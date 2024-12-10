export async function sleep(timeoutTimeInMs: number) {
  await new Promise((r) => setTimeout(r, timeoutTimeInMs));
}

/**
 *
 * @returns either false or true
 */

export function randomBoolean() {
  return !Math.round(Math.random());
}
