import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        `mt-6 w-full rounded-md border border-lines bg-primary p-2 text-lg font-medium text-white`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
