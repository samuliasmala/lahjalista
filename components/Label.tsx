import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { jost } from '~/utils/fonts';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={twMerge(`${jost.className} mb-2 text-primaryText`, className)}
      {...rest}
    />
  );
}
