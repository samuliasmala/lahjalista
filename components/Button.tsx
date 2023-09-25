import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function Button({
  id,
  handleSubmit,
  children,
  className,
  isDisabled,
  handleSubmitData,
}: {
  id: string;
  handleSubmit: () => void;
  children: ReactNode;
  className?: string;
  isDisabled?: boolean;
  handleSubmitData?: () => void;
}) {
  return (
    <button
      id={id}
      className={twMerge(
        'w-full text-s mt-6 p-2 text-white border bg-black hover:text-gray-500',
        className,
      )}
      type="button"
      onClick={handleSubmit}
    >
      {children}
    </button>
  );
}
