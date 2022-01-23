import {socialStore} from "stores/view";

import type {Message} from "models/view/Social";

interface Params {
  sender: string;
  text: string;
  date: Date;
}

const sendChatMsgReceiver = (params: Params): void => {
  const {sender, text, date} = params;
  const message: Message = {username: sender, text, date};

  socialStore.update((store) => {
    store
      .friends
      .find((friend) => friend.username === sender)
      .messages
      .push(message);

    return store;
  });
};

export default sendChatMsgReceiver;
