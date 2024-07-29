import type { SVGProps } from 'react';

const SvgTrashCan = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 21"
    {...props}
  >
    <path
      stroke="#594F47"
      strokeWidth={1.5}
      d="M5 5.5h10v12H5z"
      clipRule="evenodd"
    />
    <path
      stroke="#594F47"
      strokeWidth={1.5}
      d="M2 5.5h16M8 8.5v6M12 8.5v6M8 5.5v-3h4v3"
    />
  </svg>
);
export default SvgTrashCan;
