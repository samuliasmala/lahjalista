import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={twMerge(`text-primaryText mb-2`, className)} {...rest} />
  );
}
