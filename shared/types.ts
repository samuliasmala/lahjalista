import { z } from 'zod';
import {
  patchAnniversarySchema,
  createFeedbackSchema,
  createGiftSchema,
  createPersonSchema,
  createSessionSchema,
  createUserSchema,
  feedbackSchema,
  getAnniversarySchema,
  getPersonSchema,
  getSessionSchema,
  getUserSchema,
  giftSchema,
  userLoginDetailsSchema,
} from './zodSchemas';

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';

// GIFT
export type Gift = z.infer<typeof giftSchema>;

export type CreateGift = z.infer<typeof createGiftSchema>;

// USER
export type User = z.infer<typeof getUserSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

// SESSION
export type Session = z.infer<typeof getSessionSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;

// FEEDBACK
export type Feedback = z.infer<typeof feedbackSchema>;

export type CreateFeedback = z.infer<typeof createFeedbackSchema>;

// PERSON
export type Person = z.infer<typeof getPersonSchema>;

export type CreatePerson = z.infer<typeof createPersonSchema>;

// ANNIVERSARY

export type Anniversary = z.infer<typeof getAnniversarySchema>;

export type PatchAnniversary = z.infer<typeof patchAnniversarySchema>;

// UTILS
export type KeyboardEventKeys =
  | ' ' // Space
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '_'
  | '+'
  | '-'
  | '='
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Pause/Break'
  | 'Caps Lock'
  | 'Escape'
  | 'Space'
  | 'Page Up'
  | 'Page Down'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Insert'
  | 'Delete'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'Num Lock'
  | 'Scroll Lock';

export const QueryKeys = {
  LOGIN: ['login'],
  LOGOUT: ['logout'],

  REGISTER: ['register'],

  GIFTS: ['gifts'],
  CREATE_GIFT: ['createGift'],
  DELETE_GIFT: ['deleteGift'],

  CREATE_FEEDBACK: ['createFeedback'],

  // ei vielä käytössä
  //GIFT_DETAILS: (uuid: string) => ['gifts', uuid],
};
