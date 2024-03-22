import { isAxiosError } from 'axios';

export function handleDefaultError(e: unknown) {
  if (isAxiosError(e)) {
    if (e.code === 'ERR_BAD_RESPONSE') {
      return typeof e.response?.data === 'string'
        ? e.response?.data
        : 'Palvelin virhe!';
    }
    if (e.code === 'ERR_BAD_REQUEST') {
      return typeof e.response?.data === 'string'
        ? e.response?.data
        : 'Palvelin virhe!';
    }
    return 'Palvelin virhe!';
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

export function handleUserError(e: unknown) {
  if (isAxiosError(e) && e.response?.status === 400) {
    console.error('Sähköposti on jo käytössä!');
  } else if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
}
