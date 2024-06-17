import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        'ps-1 pt-3 pb-3 border border-lines hover:bg-gray-100 rounded-md',
        className,
      )}
      {...rest}
    />
  );
}
