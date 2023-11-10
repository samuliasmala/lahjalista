import { HTMLAttributes } from 'react';
import { Container } from './Container';
import { twMerge } from 'tailwind-merge';

type ModalType = HTMLAttributes<HTMLDivElement> & {
  firstContainerClassName?: string;
  secondContainerClassName?: string;
};

export function Modal({
  children,
  firstContainerClassName,
  secondContainerClassName,
}: ModalType) {
  return (
    <Container className={twMerge("absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]", firstContainerClassName)}>
      <Container className={twMerge("grid w-96 sm:w-96 border border-yellow-300 bg-gray-200", secondContainerClassName)}>
        {children}
      </Container>
    </Container>
  );
}
