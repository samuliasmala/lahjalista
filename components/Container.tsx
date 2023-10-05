import { HTMLAttributes } from 'react';

export function Container({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest}>{children}</div>;
}
