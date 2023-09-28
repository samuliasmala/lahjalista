import { ReactNode } from 'react';

export function Label({
  id,
  htmlFor,
  className,
  children,
}: {
  id?: string;
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <label id={id} htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}
