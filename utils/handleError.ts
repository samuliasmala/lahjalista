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

type KnownFrontEndErrorTexts = 'email was not unique!' | string;

const USER_ERROR_HANDLER: Record<KnownFrontEndErrorTexts, string> = {
  'email was not unique!': 'Sähköposti on jo käytössä',
};

export function handleRegisterError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 400) {
    const responseText = e.response.data.toLowerCase();
    if (
      typeof e.response.data === 'string' &&
      USER_ERROR_HANDLER[responseText]
    ) {
      console.error(USER_ERROR_HANDLER[responseText]);
      return USER_ERROR_HANDLER[responseText];
    } else {
      console.error('Unexpected error occured!');
      console.error('Unexpected error: ', e.response.data);
    }
  } else if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
  return '';
}
