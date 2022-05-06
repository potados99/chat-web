import io from 'socket.io-client';
import useClients from './hooks/useClients';
import useUsername from './hooks/useUsername';
import useMessages from './hooks/useMessages';
import React, {useState} from 'react';
import Config from './Config';
import useGreetings from './hooks/useGreetings';
import styled from 'styled-components';
import ExpandableTextArea from './components/ExpandableTextArea';
import MessageItem from './components/MessageItem';

const socket = io(Config.baseUrl);

function App() {
  const username = useUsername();
  const clients = useClients(socket);
  const messages = useMessages(socket);
  const [input, setInput] = useState<string>('');

  useGreetings(socket, username);

  const send = () => {
    socket.emit('chat', {sender: username, body: input, sentAt: new Date().getTime()});
    setInput('');
  };

  return (
    <Container>
      <Toolbar>
        <Clients>
          {clients
            .sort((l, r) => l.enteredAt - r.enteredAt)
            .map((m) => m.username)
            .join(', ')}
        </Clients>
      </Toolbar>
      <Messages>
        <NonStyledList>
          {messages
            .sort((l, r) => l.sentAt - r.sentAt)
            .map((m) => (
              <MessageItem key={JSON.stringify(m)} message={m} />
            ))}
        </NonStyledList>
      </Messages>
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
          />
          <SendButton>{'>'}</SendButton>
        </ComposeForm>
      </ComposeBar>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
`;

const Toolbar = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;

  padding: 12px;

  background: rgb(255, 255, 255, 80%);
  backdrop-filter: blur(5px);
`;

const Clients = styled.div`
  width: 100%;
  font-weight: bold;
  text-align: center;
`;

const Messages = styled.div`
  display: flex;
  padding-top: 40px;
  padding-bottom: 90px;
`;

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

  background: rgb(255, 255, 255, 80%);
  backdrop-filter: blur(5px);
`;

const ComposeForm = styled.form`
  display: flex;

  border: darkgray 0.75px solid;
  border-radius: 20px;
  margin: 10px;
`;

const TextInput = styled(ExpandableTextArea)`
  flex: 1;
  border: none;
  background: none;
  font-size: 18px;
  outline: none;
  text-align: start;
  margin: 8px 12px;
`;

const SendButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  align-self: end;
  margin: 3px;
  background: cornflowerblue;
  color: white;
  font-weight: bold;
  border: none;
`;

export default App;
