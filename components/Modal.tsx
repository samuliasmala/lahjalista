import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export function Modal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return createPortal(
    <>
      <div className="fixed left-0 top-0 z-[98] h-full w-full bg-black opacity-20" />
      <div className="absolute left-[50%] top-[50%] z-[99] translate-x-[-50%] translate-y-[-50%] ">
        <div
          className={twMerge(
            'grid w-96 rounded-md border border-lines bg-bgForms',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
