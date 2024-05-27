import { z } from 'zod';
import { emailRegex, passwordRegex } from '../shared/regexPatterns';

export const firstNameZodCheck = z
  .string()
  .min(1, 'Etunimi on pakollinen!')
  .max(128, 'Etunimi on liian pitkä, maksimipituus on 128 merkkiä');

export const lastNameZodCheck = z
  .string()
  .min(1, 'Sukunimi on pakollinen!')
  .max(128, 'Sukunimi on liian pitkä, maksimipituus on 128 merkkiä');

export const emailZodCheck = z
  .string()
  .min(1, 'Sähköposti on pakollinen!')
  .max(128, 'Sähköposti on liian pitkä, maksimipituus on 128 merkkiä')
  .regex(emailRegex, 'Sähköposti on virheellinen');

export const passwordZodCheck = z
  .string()
  .min(1, 'Salasana on pakollinen!')
  .max(128, 'Salasana on liian pitkä, maksimipituus on 128 merkkiä')
  .regex(
    passwordRegex,
    'Salasanan täytyy olla vähintään 8 merkkiä pitkä, maksimissaan 128 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki!',
  );
