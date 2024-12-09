import { useEffect } from 'react';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';

export function useCatchQueryErrors(isError: boolean, error: Error | null) {
  // Otetaan isError-parametri pois ja jätetään vain error-parametri ja tehdään seuraava tarkistus:
  /*
    if(!error) return
   
    handleErrorToast(handleError(error))
    return
    */
  // tai jotain vastaavaa

  useEffect(() => {
    if (isError) {
      handleErrorToast(handleError(error));
    }
    console.log(isError, error);
  }, [isError]);
}
