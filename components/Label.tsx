import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={twMerge(`text-primary-text mb-2`, className)} {...rest} />
  );
}
