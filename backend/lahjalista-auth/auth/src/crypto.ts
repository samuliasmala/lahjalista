import { generateRandomString } from '@oslojs/crypto/random';
import type { RandomReader } from '@oslojs/crypto/random';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

const random: RandomReader = {
  read(bytes: Uint8Array): void {
    crypto.getRandomValues(bytes);
  },
};

export function generateId(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return generateRandomString(random, alphabet, length);
}

export function generateUUID() {
  return crypto.randomUUID().toString();
}

export function generateIdFromEntropySize(size: number): string {
  const buffer = crypto.getRandomValues(new Uint8Array(size));
  return encodeBase32LowerCaseNoPadding(buffer);
}
