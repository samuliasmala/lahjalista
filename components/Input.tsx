import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        'pl-2 pt-3 pb-3 border border-lines bg-bgForms hover:bg-primaryLight rounded-md',
        className,
      )}
      {...rest}
    />
  );
}
