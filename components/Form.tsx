import { FormHTMLAttributes } from 'react';

export function Form({
  children,
  ...rest
}: FormHTMLAttributes<HTMLFormElement>) {
  return <form {...rest}>{children}</form>;
}
