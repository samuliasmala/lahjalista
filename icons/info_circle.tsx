/*
Attribution CC BY
You are free:

to share – to copy, distribute and transmit the work
to remix – to adapt the work

Under the following terms:

attribution – you must give appropriate credit, provide a link to the license, and indicate if changes were made
share alike – If you remix, transform, or build upon the material, you can distribute your work under any license

Credits: https://www.svgrepo.com/svg/522904/info-circle
*/

import type { SVGProps } from 'react';
const SvgInfoCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="#000">
      <path d="M12 17.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75M12 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
      <path
        fillRule="evenodd"
        d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5"
        clipRule="evenodd"
      />
    </g>
  </svg>
);
export default SvgInfoCircle;
