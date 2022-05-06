import {Socket} from 'socket.io-client';
import {Chat, Message, Notice} from '../types/messaging';
import {useCallback, useEffect, useState} from 'react';

export default function useMessages(socket: Socket) {
  const [messages, setMessages] = useState<Message[]>([]);

  const updateChat = useCallback(
    ({sender, body, sentAt}: Chat) => {
      setMessages([...messages, {type: 'chat', sender, body, sentAt, receivedAt: Date.now()}]);
    },
    [messages]
  );

  const updateNotice = useCallback(
    ({body, sentAt}: Notice) => {
      setMessages([...messages, {type: 'notice', body, sentAt, receivedAt: Date.now()}]);
    },
    [messages]
  );

  useEffect(() => {
    socket.on('chat', updateChat);
    socket.on('notice', updateNotice);
  }, [socket, updateChat, updateNotice]);

  return messages;
}
