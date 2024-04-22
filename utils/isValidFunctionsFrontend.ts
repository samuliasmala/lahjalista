import { z } from 'zod';
import { emailRegex, passwordRegex } from '../shared/regexPatterns';

export type ValidErrorFound = 'lengthError' | 'regexError';

export function isEmailValid(email: string): ValidErrorFound | true {
  if (email.length <= 0) {
    return 'lengthError';
  }
  // this should check with regex that there cannot be multiple dots etc
  const checkedEmailAddress = email.toLowerCase().match(emailRegex);

  if (!checkedEmailAddress) {
    return 'regexError';
  }

  // email is ready to be used
  return true;
}

export function isFirstNameValid(firstName: string): boolean {
  z.string().min(1).max(128).parse(firstName);
  return true;
}

export function isLastNameValid(lastName: string): boolean {
  z.string().min(1).max(128).parse(lastName);
  return true;
}

export function isPasswordValid(password: string): ValidErrorFound | true {
  const zodCheck = z
    .string()
    .min(1)
    .max(128)
    .regex(passwordRegex)
    .safeParse(password);
  if (!zodCheck.success) {
    console.log(zodCheck.error);
    const isTooSmallFound = zodCheck.error.issues.find(
      (error) => error.code === 'too_small',
    );

    if (isTooSmallFound) return 'lengthError';

    const isRegexErrorFound = zodCheck.error.issues.find(
      (error) => error.code === 'invalid_string',
    );

    if (isRegexErrorFound) return 'regexError';
  }
  return true;
}
