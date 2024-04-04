import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import type { CreateUser } from '~/shared/types';
import { emailRegex, passwordRegex } from '~/utils/regexPatterns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    const requestBody = req.body as CreateUser;
    if (
      !requestBody.email ||
      !requestBody.firstName ||
      !requestBody.lastName ||
      !requestBody.password
    ) {
      throw new HttpError('Invalid request body!', 400);
    }
  } catch (e) {
    return handleError(res, e);
  }
}

function isFirstNameValid(firstName: string): boolean {
  if (firstName.length <= 0) {
    throw new HttpError('First name is mandatory!', 400);
  }
  return true;
}

function isLastNameValid(lastName: string): boolean {
  if (lastName.length <= 0) {
    throw new HttpError('Last name is mandatory!', 400);
  }
  return true;
}

function isEmailValid(email: string): boolean {
  if (email.length <= 0) {
    throw new HttpError('Email is mandatory!', 400);
  }
  // this should check with regex that there cannot be multiple dots etc
  const checkedEmailAddress = email.toLowerCase().match(emailRegex);

  if (!checkedEmailAddress) {
    throw new HttpError('Invalid email!', 400);
  }

  // email is ready to be used
  return true;
}

function isPasswordValid(password: string): boolean {
  if (password.length <= 0) {
    throw new HttpError('Password is mandatory!', 400);
  }
  // TLDR: 8 merkkiä pitkä, maksimissaan 128, vähintään 1 numero, 1 pieni ja iso kirjain sekä yksi erikoismerkki
  const checkedPassword = password.match(passwordRegex);

  if (!checkedPassword) {
    throw new HttpError('Invalid password!', 400);
  }

  return true;
}
