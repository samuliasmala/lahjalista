import { ReactNode } from 'react';



export function Container({
  id, className, children
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return(
    <div
    id={id}
    className={className}
    >
      {children}
    </div>
  )
}
