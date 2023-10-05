import { LabelHTMLAttributes } from 'react';

export function Label({
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...rest}>{children}</label>;
}
