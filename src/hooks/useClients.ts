import {Socket} from 'socket.io-client';
import {Client} from '../types/messaging';
import {useCallback, useEffect, useState} from 'react';

export default function useMessages(socket: Socket) {
  const [clients, setClients] = useState<Client[]>([]);

  const updateClients = useCallback((clients: Client[]) => {
    setClients(clients);
  }, []);

  useEffect(() => {
    socket.on('clients', updateClients);
  }, [socket, updateClients]);

  return clients;
}
