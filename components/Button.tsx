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
        `mt-6 w-full rounded-md border border-lines bg-primary p-2 text-white ${jost.className} text-lg font-medium`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
