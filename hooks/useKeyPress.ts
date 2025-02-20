import { useEffect } from 'react';
import { KeyboardEventKeys } from '~/shared/types';

export function useKeyPress(key: KeyboardEventKeys, onKeyPress: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === key) {
        onKeyPress();
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, onKeyPress]);
}
