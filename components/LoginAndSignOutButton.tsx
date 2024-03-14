import { ButtonHTMLAttributes } from 'react';
import { Button } from './Button';

export function LoginAndSignOutButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button className={className} {...rest}>
      {children}
    </Button>
  );
}
