import {Chat} from '../types/messaging';
import styled from 'styled-components';

type Props = {
  chat: Chat;
};

export default function ChatItem({chat}: Props) {
  return (
    <Container>
      <SenderAndTimestamp>
        <Sender>{chat.sender}</Sender>
        <Timestamp>{new Date(chat.sentAt).toTimeString()}</Timestamp>
      </SenderAndTimestamp>
      <Body>{chat.body}</Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: start;

  margin: 16px;
  gap: 4px;
`;

const SenderAndTimestamp = styled.div`
  display: flex;
  flex: 1;

  flex-direction: row;
  justify-content: stretch;
  align-items: center;

  gap: 6px;
`;

const Sender = styled.div`
  font-size: 16px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: lightslategray;
`;

const Body = styled.div`
  font-size: 16px;
  white-space: pre-wrap;
`;
