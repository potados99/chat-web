export type Message = Chat | Notice;

export type Chat = {
  type: 'chat';
  sender: string;
  body: string;
  sentAt: number;
  receivedAt: number;
};

export type Notice = {
  type: 'notice';
  body: string;
  sentAt: number;
  receivedAt: number;
};

export type Client = {
  username: string;
  enteredAt: number;
};
