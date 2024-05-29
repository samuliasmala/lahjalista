import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        'ps-1 pt-3 pb-3 border border-black hover:bg-gray-100 rounded-md',
        className,
      )}
      {...rest}
    />
  );
}
