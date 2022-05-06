import styled from 'styled-components';
import React from 'react';
import {Message} from '../types/messaging';
import NoticeItem from './NoticeItem';
import ChatItem from './ChatItem';

type Props = React.LiHTMLAttributes<HTMLLIElement> & {
  message: Message;
};

export default function MessageItem({message}: Props) {
  return (
    <ListItem>
      {message.type === 'chat' ? <ChatItem chat={message} /> : <NoticeItem notice={message} />}
    </ListItem>
  );
}

const ListItem = styled.li`
  padding: 0;
  margin: 0;
`;
