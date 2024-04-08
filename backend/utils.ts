import { emailRegex, passwordRegex } from '~/shared/regexPatterns';
import { compare as bcryptCompare, hash } from 'bcrypt';

export function isEmailValid(email: string): boolean {
  if (email.length <= 0) {
    return false;
  }
  // this should check with regex that there cannot be multiple dots etc
  const checkedEmailAddress = email.toLowerCase().match(emailRegex);

  if (!checkedEmailAddress) {
    return false;
  }

  // email is ready to be used
  return true;
}

export function isFirstNameValid(firstName: string): boolean {
  if (firstName.length <= 0) {
    return false;
  }
  return true;
}

export function isLastNameValid(lastName: string): boolean {
  if (lastName.length <= 0) {
    return false;
  }
  return true;
}

export function isPasswordValid(password: string): boolean {
  if (password.length <= 0) {
    return false;
  }
  // TLDR: 8 merkkiä pitkä, maksimissaan 128, vähintään 1 numero, 1 pieni ja iso kirjain sekä yksi erikoismerkki
  const checkedPassword = password.match(passwordRegex);

  if (!checkedPassword) {
    return false;
  }

  return true;
}

export async function verifyPassword(
  givenPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcryptCompare(givenPassword, hashedPassword);
  return isMatch;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}
