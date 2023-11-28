import { HTMLAttributes } from 'react';
import { Container } from './Container';
import { twMerge } from 'tailwind-merge';

export type ModalType = HTMLAttributes<HTMLDivElement> & {
  firstContainerClassName?: string;
  secondContainerClassName?: string;
  onClose?: () => void;
};

export function Modal({
  children,
  firstContainerClassName,
  secondContainerClassName,
  onClose,
}: ModalType) {
  return (
    <>
      <Container
        onClick={onClose}
        className={twMerge(
          'fixed top-0 left-0 w-full h-full z-10 bg-black opacity-20',
          firstContainerClassName,
        )}
      ></Container>
      <Container
        className={twMerge(
          'z-20 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-96 bg-white',
          secondContainerClassName,
        )}
      >
        {children}
      </Container>
    </>
  );
}
