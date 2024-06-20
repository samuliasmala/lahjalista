import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { libre_bodoni } from '~/utils/fonts';

export function TitleText({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        `text-2xl pt-4 ${libre_bodoni.className} text-center font-medium`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
