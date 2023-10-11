import { HTMLAttributes } from 'react';

export function TitleText({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest}>{children}</div>;
}
