import { z } from 'zod';
import {
  createFeedbackSchema,
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  feedbackSchema,
  frontendSessionSchema,
  getUserSchema,
  giftSchema,
  invalidSessionResultSchema,
  sessionSchema,
  userLoginDetailsSchema,
  validSessionResultSchema,
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
export type Session = z.infer<typeof sessionSchema>;

export type FrontendSession = z.infer<typeof frontendSessionSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;

export type ValidSessionResult = z.infer<typeof validSessionResultSchema>;
export type InvalidSessionResult = z.infer<typeof invalidSessionResultSchema>;

export type GetUserAndSessionResult = ValidSessionResult | InvalidSessionResult;

// FEEDBACK
export type Feedback = z.infer<typeof feedbackSchema>;

export type CreateFeedback = z.infer<typeof createFeedbackSchema>;

// MISC

export type DatabaseAdapter = {
  createSession: (sessionData: CreateSession) => Promise<Session | null>;
  deleteSession: (sessionUUID: string) => Promise<void>;
  //setSession: () => Promise<void>; // createSession is same
  getSession: (sessionUUID: string) => Promise<Session | null>;
  //prettier-ignore
  getUserFromSession: (sessionUUID: string) => Promise<User | null>; // potentially a dangerous function
  // prettier-ignore
  getUserAndSessions: (userUUID: string) => Promise<[Session[], User] | null>; // gets the user and ALL the sessions
  //prettier-ignore
  getUserAndSession: (sessionUUID: string) => Promise<GetUserAndSessionResult>; // gets the user and ONLY ONE session
  getUserSessions: (userUUID: string) => Promise<Session[]>; // gets all the sessions belonging to a ONE user
  // prettier-ignore
  updateSessionExpirationDate: (sessionUUID: string, newSessionExpirationDate: Date) => Promise<void>;
  deleteUserSessions: (userUUID: string) => Promise<void>; // deletes all the sessions belonging to a user
  deleteExpiredSessions: () => Promise<void>;
};

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

// CHECK THIS, onko mitään järkeä

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
