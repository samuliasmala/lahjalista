import { z } from 'zod';
import { emailRegex, passwordRegex } from '../shared/regexPatterns';

export function isEmailValid(email: string): boolean {
  const zodCheck = z
    .string()
    .min(1)
    .max(128)
    .regex(emailRegex)
    .safeParse(email);

  if (!zodCheck.success) {
    return false;
  }

  return true;
}

export function isFirstNameValid(firstName: string): boolean {
  const zodCheck = z.string().min(1).max(128).safeParse(firstName);

  if (!zodCheck.success) {
    return false;
  }

  return true;
}

export function isLastNameValid(lastName: string): boolean {
  const zodCheck = z.string().min(1).max(128).safeParse(lastName);

  if (!zodCheck.success) {
    return false;
  }

  return true;
}

export function isPasswordValid(password: string): boolean {
  const zodCheck = z
    .string()
    .min(1)
    .max(128)
    .regex(passwordRegex)
    .safeParse(password);

  if (!zodCheck.success) {
    return false;
  }

  return true;
}
