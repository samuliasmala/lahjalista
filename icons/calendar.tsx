import type { SVGProps } from 'react';
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path stroke="#000" strokeWidth={2} d="M3 5h14v11H3z" clipRule="evenodd" />
    <path stroke="#000" strokeWidth={2} d="M6 2v2M14 2v2M3 9h14" />
  </svg>
);
export default SvgCalendar;
