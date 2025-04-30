import { Dispatch, SetStateAction, useEffect } from 'react';
import { UAParser } from 'ua-parser-js';
import { Browser as BrowserEnum } from 'ua-parser-js/enums';

type Browser = (typeof BrowserEnum)[keyof typeof BrowserEnum];

const BROWSERS: string[] & Partial<Browser>[] = ['Mobile Firefox', 'Firefox'];

export function useIsFirefox(
  isFirefox: boolean,
  setIsFirefox: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    // navigator or window.navigator should be supported in Node.js version 21.1.0 and higher, another error says that (see under)
    // with node version set ^22 in package.json it should be fine. Without using eslint-disable-next-line, ESLint throws the following error
    // "Error: The 'navigator' is still an experimental feature The configured version range is '^21'.  n/no-unsupported-features/node-builtins"

    // when node version was set ^20 ESLint threw this following error
    // The 'navigator.userAgent' is still an experimental feature and is not supported until Node.js 21.1.0. The configured version range is '^20'.
    // which tells it should totally work in Node versions of 22>=

    // eslint-disable-next-line
    const userAgent = UAParser(window.navigator.userAgent);
    const browserName = userAgent.browser.name ?? '';

    if (BROWSERS.includes(browserName)) {
      setIsFirefox(true);
    }
  }, [isFirefox, setIsFirefox]);
}
