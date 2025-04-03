import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { TitleText } from './TitleText';
import SvgXClose from '~/icons/x_close';
import { useKeyPress } from '~/hooks/useKeyPress';

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
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-20" />
      <div className="absolute top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        <div
          className={twMerge(
            'border-lines bg-bgForms grid w-96 rounded-md border',
            className,
          )}
        >
          <div className="flex flex-row justify-between">
            <TitleText className={`text-primaryText m-6 text-base font-medium`}>
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
