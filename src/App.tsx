/* eslint-disable no-restricted-globals */
import io from 'socket.io-client';
import Config from './Config';
import styled from 'styled-components';
import useClients from './hooks/useClients';
import useUsername from './hooks/useUsername';
import useMessages from './hooks/useMessages';
import MessageItem from './components/MessageItem';
import useGreetings from './hooks/useGreetings';
import ExpandableTextArea from './components/ExpandableTextArea';
import React, {useEffect, useRef, useState} from 'react';
import truncate from './common/utils';

const socket = io(Config.baseUrl);

function App() {
  const clients = useClients(socket);
  const username = useUsername();
  const messages = useMessages(socket);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<string>('');

  /**
   * 메시지가 바뀌면 맨 밑으로 스크롤합니다.
   */
  useEffect(() => {
    /**
     * iOS 15의 사파리 하단 safe area 문제 때문에 scrollIntoView를 편하게 쓸 수 없습니다.
     */
    window.scrollTo({
      top: window.scrollY + (messagesEnd.current?.getBoundingClientRect().top ?? 0),
      behavior: 'smooth',
    });
  }, [messages]);

  /**
   * 사용자 이름이 바뀌면 인사를 보냅니다.
   */
  useGreetings(socket, username);

  const send = () => {
    if (input.length === 0) {
      return;
    }

    socket.emit('chat', {sender: username, body: input, sentAt: new Date().getTime()});
    setInput('');
  };

  return (
    <Container>
      <Toolbar>
        <Clients>
          {clients
            .sort((l, r) => l.enteredAt - r.enteredAt)
            .map((m) => truncate(m.username, 10))
            .join(', ')}
        </Clients>
      </Toolbar>
      <Messages>
        <NonStyledList>
          {messages
            .sort((l, r) => l.receivedAt - r.receivedAt)
            .map((m) => (
              <MessageItem key={JSON.stringify(m)} message={m} />
            ))}
        </NonStyledList>
      </Messages>
      <MessagesEnd ref={messagesEnd} />
      <ComposeBar>
        <ComposeForm
          id="form"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <TextInput
            id="input"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              /**
               * PC에서 엔터 키를 ALT 없이 누를 때에만 전송 버튼을 누른 것으로 취급합니다.
               */
              const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');
              const isEnter = e.key === 'Enter' && !e.altKey;

              if (isEnter && !isMobile) {
                e.preventDefault();
                send();
              }
            }}
          />
          <SendButton disabled={input.length === 0}>
            <img src={'/images/arrow-up.svg'} alt={'보내기 버튼'} />
          </SendButton>
        </ComposeForm>
      </ComposeBar>
    </Container>
  );
}

const Container = styled.div``;

const Toolbar = styled.div`
  display: flex;

  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px;

  background: #ffffff80;
  backdrop-filter: blur(5px);
  border-bottom: #c0c0c0 0.5px solid;
`;

const Clients = styled.div`
  width: 100%;
  font-weight: bold;
  text-align: center;
`;

const Messages = styled.div`
  display: flex;
  padding-top: 30px;
  padding-bottom: 40px;
`;

const MessagesEnd = styled.div``;

const NonStyledList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const ComposeBar = styled.div`
  z-index: 1;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  background: #ffffff80;
  backdrop-filter: blur(5px);
`;

const ComposeForm = styled.form`
  display: flex;

  border: #c0c0c0 0.7px solid;
  border-radius: 20px;
  margin: 10px;
`;

const TextInput = styled(ExpandableTextArea)`
  flex: 1;
  border: none;
  background: none;
  font-size: 16px;
  outline: none;
  text-align: start;
  margin: 8px 12px;
`;

const SendButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 34px;
  height: 34px;
  border-radius: 50%;
  align-self: end;
  margin: 3px;
  background: rgb(0, 127, 255);
  color: white;
  font-weight: bold;
  border: none;
  opacity: ${({disabled}) => (disabled ? '0.3' : '1.0')};
`;

export default App;
