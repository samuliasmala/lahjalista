import { isAxiosError } from 'axios';

export function handleGeneralError(e: unknown) {
  if (isAxiosError(e)) {
    return typeof e.response?.data === 'string'
      ? e.response.data
      : 'Palvelin virhe!';
  }
  if (e instanceof Error) {
    const knownErrorText =
      FRONT_END_POSSIBLE_ERRORS[
        e.message.toLocaleLowerCase() as KnownFrontEndErrorTexts
      ];
    if (knownErrorText) {
      console.error(knownErrorText);
      return knownErrorText;
    }
    return e.message;
  } else {
    return 'Odottamaton virhe tapahtui!';
  }
}

export function handleGiftError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 404) {
    console.error('Lahjaa ei löytynyt palvelimelta!');
    return 'Lahjaa ei löytynyt palvelimelta!';
  } else if (e instanceof Error) {
    console.error(e.message);
    return e.message;
  } else {
    console.error(e);
    return 'Tuntematon virhe';
  }
}

const FRONT_END_POSSIBLE_ERRORS = {
  // /pages/logout.tsx
  'feedback was invalid!': 'Palauteteksti on virheellinen!',
  'feedback text is mandatory!': 'Palauteteksti on pakollinen!',
  'server error!': 'Palvelin virhe!',
  'palvelin virhe!': 'Palvelin virhe!',
  'odottamaton virhe tapahtui!': 'Odottamaton virhe tapahtui!',
  'you are unauthorized!':
    'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen antaaksesi palautteen!',

  // line below is only used when trying to register
  'email was not unique!': 'Sähköposti on jo käytössä',

  // the lines below are used when trying to login
  'invalid password!': 'Salasana on virheellinen!',
  'user was not found in database!': 'Sähköpostia ei ole rekistöröity!',

  // the lines below most likely will not show up often due to them being errors Zod throws if values are not correct
  // Because of client-side Zod checks, invalid values should not be possible to be sent. Only possible way should be if user sends the request straight to the API
  'email field was invalid!': 'Sähköposti on virheellinen!',
  'password field was invalid!': 'Salasana on virheellinen!',
  'email or password field was invalid!':
    'Sähköposti tai salasana on virheellinen!',
} as const;

type KnownFrontEndErrorTexts = keyof typeof FRONT_END_POSSIBLE_ERRORS;

export function handleAuthErrors(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 400) {
    if (typeof e.response.data !== 'string') {
      console.error('Unexpected error occured!');
      console.error('Unexpected error: ', e.response.data);
      return 'Palvelin virhe!';
    }
    const responseText = e.response.data.toLowerCase();
    const frontendText =
      FRONT_END_POSSIBLE_ERRORS[responseText as KnownFrontEndErrorTexts];
    if (frontendText) {
      console.error(frontendText);
      return frontendText;
    } else {
      console.error('Unexpected error occured!');
      console.error('Unexpected error: ', e.response.data);
      return 'Palvelin virhe!';
    }
  } else if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
  return '';
}
