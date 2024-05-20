import { z } from 'zod';
import { emailRegex, passwordRegex } from '../shared/regexPatterns';

export function isFirstNameValid(firstName: string) {
  const zodCheck = z
    .string()
    .min(1, { message: 'too_small' })
    .max(128, { message: 'too_big' })
    .safeParse(firstName);
  return zodCheck.success ? zodCheck.success : zodCheck.error.issues[0];
}

export function isLastNameValid(lastName: string) {
  const zodCheck = z
    .string()
    .min(1, { message: 'too_small' })
    .max(128, { message: 'too_big' })
    .safeParse(lastName);
  return zodCheck.success ? zodCheck.success : zodCheck.error.issues[0];
}

export function isEmailValid(email: string) {
  const zodCheck = z
    .string()
    .min(1, { message: 'too_small' })
    .max(128, { message: 'too_big' })
    .regex(emailRegex, { message: 'regex' })
    .safeParse(email.toLowerCase());
  return zodCheck.success ? zodCheck.success : zodCheck.error.issues[0];
}

export function isPasswordValid(password: string) {
  const zodCheck = z
    .string()
    .min(1, { message: 'too_small' })
    .max(128, { message: 'too_big' })
    .regex(passwordRegex, { message: 'regex' })
    .safeParse(password);
  return zodCheck.success ? zodCheck.success : zodCheck.error.issues[0];
}
