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
        'w-full text-s mt-6 p-2 text-white border bg-black hover:text-gray-500 rounded-md',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
