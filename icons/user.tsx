import type { SVGProps } from 'react';

type SVGUser = SVGProps<SVGSVGElement> & {
  strokeClassName?: string;
};

const SvgUser = ({ strokeClassName, ...props }: SVGUser) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 20"
    {...props}
  >
    <path
      stroke="#404040"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className={strokeClassName}
      d="M17 19c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C1 16.907 1 17.604 1 19M13.5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0"
    />
  </svg>
);
export default SvgUser;
