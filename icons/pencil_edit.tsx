import type { SVGProps } from 'react';

const SvgPencilEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 21"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="m12 5.5 3 3-9 9H3v-3zM14 3.5l3 3 1.293-1.293a1 1 0 0 0 0-1.414l-1.586-1.586a1 1 0 0 0-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPencilEdit;
