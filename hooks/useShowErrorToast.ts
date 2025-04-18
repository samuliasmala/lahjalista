import { useEffect } from 'react';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';

export function useShowErrorToast(error: Error | null) {
  useEffect(() => {
    if (!error) return;

    handleErrorToast(handleError(error));
  }, [error]);
}
