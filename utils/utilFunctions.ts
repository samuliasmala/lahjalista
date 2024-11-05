// THESE ARE USED IN DEVELOPMENT MOSTLY

// CHECK THIS, kehittämisvaiheessa käytettäviä

// miten toimii, jos tietokannalla kestää vaikka 5 sec palauttaa vastaus ym

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
