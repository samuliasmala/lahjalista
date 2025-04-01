import { Dispatch, SetStateAction, useEffect } from 'react';
import { UAParser } from 'ua-parser-js';
import { Browser as BrowserEnum } from 'ua-parser-js/enums';

type Browser = (typeof BrowserEnum)[keyof typeof BrowserEnum];

const BROWSERS: Partial<Browser | String>[] = [
  'Mobile Firefox',
  'Firefox',
  'Mobile Safari',
  'Safari',
];

export function useIsFirefoxOrSafari(
  isFirefoxOrSafari: boolean,
  setIsFirefoxOrSafari: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    const userAgent = UAParser(window.navigator.userAgent);
    const browserName = userAgent.browser.name ?? '';

    if (BROWSERS.includes(browserName)) {
      setIsFirefoxOrSafari(true);
    }
  }, [isFirefoxOrSafari]);
}
