import { isAxiosError } from 'axios';
import Router from 'next/router';

const FRONT_END_POSSIBLE_ERRORS = {
  // General errors
  'you are unauthorized!':
    'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen jatkaaksesi!',

  // Gift errors
  'gift was not found on the server!': 'Lahjaa ei löytynyt palvelimelta!',

  // /pages/logout.tsx
  'feedback was invalid!': 'Palauteteksti on virheellinen!',
  'feedback text is mandatory!': 'Palauteteksti on pakollinen!',
  'server error!': 'Palvelin virhe!',
  'palvelin virhe!': 'Palvelin virhe!',
  'odottamaton virhe tapahtui!': 'Odottamaton virhe tapahtui!',

  // /pages/register.tsx
  'email was not unique!': 'Sähköposti on jo käytössä',

  // /pages/login.tsx
  'invalid password!': 'Salasana on virheellinen!',
  'user was not found in database!': 'Sähköpostia ei ole rekistöröity!',

  // the lines below most likely will not show up often due to them being errors Zod throws if values are not correct
  // Because of client-side Zod checks, invalid values should not be possible to be sent.
  // Only possible way should be if user sends the request straight to the API
  'email field was invalid!': 'Sähköposti on virheellinen!',
  'password field was invalid!': 'Salasana on virheellinen!',
  'email or password field was invalid!':
    'Sähköposti tai salasana on virheellinen!',
} as const;

type KnownFrontEndErrorTexts = keyof typeof FRONT_END_POSSIBLE_ERRORS;

export function handleError(e: unknown) {
  if (e instanceof Error === false) {
    console.error(e);
    return 'Tuntematon virhe!';
  }
  console.error(e);
  if (isAxiosError(e)) {
    if (e.response?.status === 401) {
      Router.push('/login');
      return 'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen jatkaaksesi!';
    }
    const knownErrorText =
      e.response?.data && typeof e.response.data === 'string'
        ? FRONT_END_POSSIBLE_ERRORS[
            e.response.data.toLocaleLowerCase() as KnownFrontEndErrorTexts
          ]
        : null;

    if (knownErrorText) {
      console.error(knownErrorText);
      return knownErrorText;
    }

    console.error('Unexpected error occured!');
    console.error('Unexpected error: ', e.response?.data);
    return 'Palvelinvirhe!';
  }

  const knownErrorText =
    FRONT_END_POSSIBLE_ERRORS[
      e.message.toLocaleLowerCase() as KnownFrontEndErrorTexts
    ];

  if (knownErrorText) {
    console.error(knownErrorText);
    return knownErrorText;
  }

  console.error(e);
  return 'Palvelinvirhe!';
}
