import { HTMLAttributes } from 'react';

export function Main({ children, ...rest }: HTMLAttributes<HTMLElement>) {
  return <main {...rest}>{children}</main>;
}
