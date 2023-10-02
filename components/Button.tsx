import { ButtonHTMLAttributes } from 'react';

export function Button({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest}>{children}</button>;
}

