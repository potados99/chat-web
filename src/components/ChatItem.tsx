import {Chat} from '../types/messaging';
import styled from 'styled-components';
import truncate from '../common/utils';

type Props = {
  chat: Chat;
};

export default function ChatItem({chat}: Props) {
  return (
    <Container>
      <SenderAndTimestamp>
        <Sender>{truncate(chat.sender, 10)}</Sender>
        <Timestamp>{new Date(chat.sentAt).toLocaleTimeString()}</Timestamp>
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

  margin: 20px 16px 20px 16px;
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
  font-weight: 600;
  font-size: 14px;
  color: #202020;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #a0a0a0;
`;

const Body = styled.div`
  font-size: 16px;
  white-space: pre-wrap;
  color: #404040;
`;
