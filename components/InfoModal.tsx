import { Container } from './Container';
import { Modal } from './Modal';
import { TitleText } from './TitleText';

type InfoModalType = {
  title: string;
  info: string;
};

export function InfoModal({ title, info }: InfoModalType) {
  return (
    <Container>
      <Modal>
        <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
          {title}
        </TitleText>
        <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">
        {info}
      </p>
      </Modal>
    </Container>
  );
}
