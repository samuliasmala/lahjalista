import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import SvgSpinner from '~/icons/spinner';

interface Spinner extends HTMLAttributes<HTMLSpanElement> {
  spinnerClassName?: string;
}

export function Spinner({ className, spinnerClassName, ...rest }: Spinner) {
  return (
    <span className={twMerge('absolute px-1 py-0.5', className)} {...rest}>
      <SvgSpinner
        className={twMerge('h-6 w-6 animate-spin', spinnerClassName)}
      />
    </span>
  );
}
