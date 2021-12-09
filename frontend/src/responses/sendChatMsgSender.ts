import {socialStore} from "stores/view";

import type {Message} from "models/view/Social";

interface Params {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

const sendChatMsgSender = (params: Params): void => {
  const {sender, receiver, text, date} = params;
  const message: Message = {username: sender, text, date};

  socialStore.update((store) => {
    store
      .friends
      .find((friend) => friend.username === receiver)
      .messages
      .push(message);

    return store;
  });
};

export default sendChatMsgSender;
