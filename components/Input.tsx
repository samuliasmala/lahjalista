import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        `rounded-md border border-lines bg-bgForms pb-3 pl-2 pt-3`,
        className,
      )}
      {...rest}
    />
  );
}
