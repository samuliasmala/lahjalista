import type { SVGProps } from 'react';

type CheckMarkIcon = SVGProps<SVGSVGElement> & {
  backgroundClassName?: string;
  checkMarkClassName?: string;
};

export const SvgCheckMarkIcon = ({
  backgroundClassName,
  checkMarkClassName,
  ...rest
}: CheckMarkIcon) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...rest}>
    <path
      className={backgroundClassName}
      d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59-5-5L10.59 15 14 18.41 21.41 11l1.596 1.586Z"
    />
    <path
      className={checkMarkClassName}
      d="m14 21.591-5-5L10.591 15 14 18.409 21.41 11l1.595 1.585L14 21.591z"
    />
  </svg>
);
