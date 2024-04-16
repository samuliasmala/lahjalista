import { isAxiosError } from 'axios';

export function handleGeneralError(e: unknown) {
  if (isAxiosError(e)) {
    return typeof e.response?.data === 'string'
      ? e.response.data
      : 'Palvelin virhe!';
  }
  if (e instanceof Error) {
    return e.message;
  } else {
    return 'Odottamaton virhe tapahtui!';
  }
}

export function handleGiftError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 404) {
    console.error('Lahjaa ei löytynyt palvelimelta!');
  } else if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
}

type KnownFrontEndErrorTexts =
  | 'email was not unique!'
  | 'invalid credentials!'
  | 'invalid request body!'
  | (string & Record<never, never>);

const FRONT_END_HANDLER: Record<KnownFrontEndErrorTexts, string> = {
  'email was not unique!': 'Sähköposti on jo käytössä',
  'invalid credentials!': 'Sähköposti tai salasana on virheellinen!',
  'invalid request body!': 'Sähköposti tai salasana on virheellinen',
};

export function handleRegisterError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 400) {
    if (typeof e.response.data !== 'string') {
      console.error('Unexpected error occured!');
      console.error('Unexpected error: ', e.response.data);
      return 'Palvelin virhe!';
    }
    const responseText = e.response.data.toLowerCase();
    if (
      typeof e.response.data === 'string' &&
      FRONT_END_HANDLER[responseText]
    ) {
      console.error(FRONT_END_HANDLER[responseText]);
      return FRONT_END_HANDLER[responseText];
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

export function handleLoginError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 400) {
    if (typeof e.response.data !== 'string') {
      console.error('Unexpected error occured!');
      console.error('Unexpected error: ', e.response.data);
      return 'Palvelin virhe!';
    }
    const responseText = e.response.data.toLowerCase();
    if (
      typeof e.response.data === 'string' &&
      FRONT_END_HANDLER[responseText]
    ) {
      console.error(FRONT_END_HANDLER[responseText]);
      return FRONT_END_HANDLER[responseText];
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
