import { z } from 'zod';
import { emailRegex, passwordRegex } from './regexPatterns';
import { Prisma } from '@prisma/client';

// FORM

const firstNameSchema = z
  .string()
  .min(1, 'Etunimi on pakollinen!')
  .max(128, 'Etunimi on liian pitkä, maksimipituus on 128 merkkiä');

const lastNameSchema = z
  .string()
  .min(1, 'Sukunimi on pakollinen!')
  .max(128, 'Sukunimi on liian pitkä, maksimipituus on 128 merkkiä');

export const emailSchema = z
  .string()
  .min(1, 'Sähköposti on pakollinen!')
  .max(128, 'Sähköposti on liian pitkä, maksimipituus on 128 merkkiä')
  .regex(emailRegex, 'Sähköposti on virheellinen')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(1, 'Salasana on pakollinen!')
  .max(128, 'Salasana on liian pitkä, maksimipituus on 128 merkkiä')
  .regex(
    passwordRegex,
    'Salasanan täytyy olla vähintään 8 merkkiä pitkä, maksimissaan 128 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki!',
  );

export const formSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// GIFT

export const giftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

export const createGiftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
});

export const updateGiftSchema = createGiftSchema;

// USER

export const userSchema = z.object({
  email: emailSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const getUserSchema = userSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
  role: z.string(),
});

export const createUserSchema = userSchema.extend({
  password: passwordSchema,
});

export const updateUserSchema = userSchema.partial();

export const userLoginDetailsSchema = createUserSchema
  .pick({ email: true, password: true })
  .extend({ rememberMe: z.boolean() });

// SESSION

export const createSessionSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.custom<Prisma.UserCreateNestedOneWithoutSessionInput>(),
});

// MISC

export const uuidParseSchema = z
  .string({ message: 'Invalid UUID! It should be given as a string!' })
  .uuid('UUID pattern was invalid!');
