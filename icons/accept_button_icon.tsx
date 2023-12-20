import type { SVGProps } from 'react';

type AcceptButtonType = SVGProps<SVGSVGElement> & {
  backgroundFill?: string;
  checkmarkFill?: string;
};

const SvgAcceptButtonIcon = ({
  backgroundFill,
  checkmarkFill,
  ...rest
}: AcceptButtonType) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...rest}>
    <path
      fill={backgroundFill || 'currentColor'}
      d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59-5-5L10.59 15 14 18.41 21.41 11l1.596 1.586Z"
    />
    <path
      fill={checkmarkFill || 'none'}
      d="m14 21.591-5-5L10.591 15 14 18.409 21.41 11l1.595 1.585L14 21.591z"
    />
  </svg>
);
export default SvgAcceptButtonIcon;
