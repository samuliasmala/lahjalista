import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        `border-lines bg-bg-forms rounded-md border pt-3 pb-3 pl-2`,
        className,
      )}
      {...rest}
    />
  );
}
