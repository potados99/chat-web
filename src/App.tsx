import io from 'socket.io-client';
import useClients from './hooks/useClients';
import useUsername from './hooks/useUsername';
import useMessages from './hooks/useMessages';
import React, {useEffect, useState} from 'react';
import Config from './Config';

const socket = io(Config.baseUrl);

function App() {
  const username = useUsername();
  const clients = useClients(socket);
  const messages = useMessages(socket);
  const [input, setInput] = useState<string>();

  useEffect(() => {
    if (username != null) {
      socket.emit('hello', {sender: username});
    }
  }, [username]);

  const send = () => {
    socket.emit('chat', {sender: username, body: input, sentAt: new Date().getTime()});
    setInput('');
  };

  return (
    <div>
      안녕 {username}.
      <ul>
        {clients
          .sort((l, r) => l.enteredAt - r.enteredAt)
          .map((m) => (
            <li key={m.enteredAt}>
              {m.username} ({new Date(m.enteredAt).toLocaleString()})
            </li>
          ))}
      </ul>
      <ul>
        {messages
          .sort((l, r) => l.sentAt - r.sentAt)
          .map((m) => (
            <li key={m.sentAt}>
              {m.type === 'chat' ? `(${m.sentAt}) ${m.sender}: ${m.body}` : `${m.body}`}
            </li>
          ))}
      </ul>
      <form
        id="form"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          id="input"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button>전송</button>
      </form>
    </div>
  );
}

export default App;
