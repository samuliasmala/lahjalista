import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { jost } from '~/utils/fonts';

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={twMerge(`${jost.className}, pb-1`, className)}
      {...rest}
    />
  );
}
