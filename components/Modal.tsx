import { HTMLAttributes, useState } from 'react';
import { Container } from './Container';

type ModalType = HTMLAttributes<HTMLDivElement> & {
  openWindow?: boolean;
}


export function Modal({ openWindow, children, ...rest }: ModalType) {
  //const [openWindow, setOpenWindow] = useState(false);

  return (
    <>
      {openWindow ? (
        <Container className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <Container className="grid w-96 sm:w-96 border border-yellow-300 bg-gray-200">
            {children}
          </Container>
        </Container>
      ) : null}
    </>
  );
}
