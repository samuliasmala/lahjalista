import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { TitleText } from './TitleText';
import SvgXClose from '~/icons/x_close';
import { useKeyPress } from '~/utils/hooks/useKeyPress';

export function Modal({
  children,
  title,
  closeModal,
  className,
}: {
  title: string;
  closeModal: () => void;
  children: ReactNode;
  className?: string;
}) {
  useKeyPress('Escape', () => closeModal());
  return createPortal(
    <>
      <div className="fixed left-0 top-0 z-[98] h-full w-full bg-black opacity-20" />
      <div className="absolute left-[50%] top-[50%] z-[99] translate-x-[-50%] translate-y-[-50%]">
        <div
          className={twMerge(
            'grid w-96 rounded-md border border-lines bg-bgForms',
            className,
          )}
        >
          <div className="flex flex-row justify-between">
            <TitleText className={`m-6 text-base font-medium text-primaryText`}>
              {title}
            </TitleText>
            <SvgXClose
              width={24}
              height={24}
              className="mr-6 self-center hover:cursor-pointer"
              onClick={() => closeModal()}
            />
          </div>

          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
