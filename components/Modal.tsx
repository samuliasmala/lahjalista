import { HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ children }: HTMLAttributes<HTMLDivElement>) {
  return createPortal(
    <>
      <div className="fixed left-0 top-0 z-[98] h-full w-full bg-black opacity-20">
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <div className="grid w-96 sm:w-96 border border-yellow-300 bg-gray-200">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
