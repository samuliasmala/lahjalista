import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function TitleText({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge('text-2xl pt-4', className)} {...rest}>
      {children}
    </div>
  );
}
