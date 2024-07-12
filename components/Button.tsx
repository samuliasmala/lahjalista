import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { jost } from '~/utils/fonts';

export function Button({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        `w-full mt-6 p-2 text-white border border-lines bg-primary rounded-md ${jost.className} font-medium text-lg`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
