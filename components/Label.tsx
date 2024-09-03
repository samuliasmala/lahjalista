import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={twMerge(`mb-2 text-primaryText`, className)} {...rest} />
  );
}
