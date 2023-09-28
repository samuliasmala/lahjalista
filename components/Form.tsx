import { ReactNode } from 'react';

export function Form({
  id,
  className,
  children,
  action,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
  action?: string;
}) {
  return (
    <form id={id} className={className} action={action}>
      {children}
    </form>
  );
}
