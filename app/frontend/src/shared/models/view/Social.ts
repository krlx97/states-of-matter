interface Message {
  username: string;
  date: Date;
  text: string;
}

interface Friend {
  username: string;
  avatarId: number;
  status: number;
  messages: Array<Message>;
}

interface Chat {
  username: string;
  avatarId: number;
  status: number;
  isOpen: boolean;
  messages: Array<Message>;
}

interface Social {
  friends: Array<Friend>;
  chat: Chat;
}

export type {Message, Friend, Chat, Social};
