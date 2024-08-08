import type { SVGProps } from 'react';

const SvgLocationPin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#000"
      strokeWidth={2}
      d="M10.606 18.236q-.345.29-.606.498a33.082 33.082 0 0 1-3.274-3.001c-.97-1.024-1.916-2.177-2.615-3.361C3.407 11.178 3 10.03 3 9c0-3.828 3.137-7 7-7s7 3.172 7 7c0 1.03-.407 2.178-1.111 3.372-.699 1.184-1.644 2.338-2.615 3.361a33 33 0 0 1-2.668 2.503Z"
    />
    <path
      stroke="#000"
      strokeWidth={2}
      d="M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgLocationPin;
