import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { errorWrapper } from '~/utils/utilFunctions';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void | Promise<void>;
};

export function Button({ children, onClick, className, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick === undefined ? undefined : errorWrapper(onClick)}
      className={twMerge(
        `border-lines bg-primary mt-6 w-full rounded-md border p-2 text-lg font-medium text-white disabled:bg-gray-300 disabled:text-gray-500`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
