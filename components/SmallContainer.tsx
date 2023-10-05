import { HTMLAttributes } from 'react';

export function SmallContainer({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest}>{children}</div>;
}
