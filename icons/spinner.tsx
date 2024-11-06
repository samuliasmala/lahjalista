/*
MIT License
You are free:

to share – to copy, distribute and transmit the work
to remix – to adapt the work
Under the following terms:

liability – the author doesn't provide any warranty and doesn't accepts any liability
copyright notice – a copy of the license or copyright notice must be included with software
share alike – If you remix, transform, or build upon the material, you can distribute your work under any license

Credits: https://www.svgrepo.com/svg/310005/spinner-ios
*/

import type { SVGProps } from 'react';
const SvgSpinner = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
    <path
      fill="currentColor"
      fillRule="nonzero"
      d="M10 3a7 7 0 0 0-7 7 .5.5 0 0 1-1 0 8 8 0 1 1 8 8 .5.5 0 0 1 0-1 7 7 0 1 0 0-14"
    />
  </svg>
);
export default SvgSpinner;
