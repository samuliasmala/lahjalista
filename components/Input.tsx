import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { jost } from '~/utils/fonts';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        `pl-2 pt-3 pb-3 border border-lines bg-bgForms rounded-md ${jost.className}`,
        className,
      )}
      {...rest}
    />
  );
}
