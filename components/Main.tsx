import { ReactNode } from 'react';




export function Main({
  id, className, children
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <main id={id} className={className}>
      {children}
    </main>
  );
}
