import {Socket} from 'socket.io-client';
import {useEffect} from 'react';

export default function useGreetings(socket: Socket, username?: string) {
  useEffect(() => {
    if (username != null) {
      socket.emit('hello', {sender: username});
    }
  }, [socket, username]);
}
