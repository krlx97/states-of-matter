import {socketService} from "services";
import {socialStore} from "stores";

export const sendChatMsgSender = () => {
  socketService.socket.on("sendChatMsgSender", (params) => {
    const {sender, receiver, text, date} = params;

    socialStore.update((store) => {
      store
        .friends
        .find((friend) => friend.username === receiver)
        .messages
        .push({username: sender, text, date});

      return store;
    });
  });
};
