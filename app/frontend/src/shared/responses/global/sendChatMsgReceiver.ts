import {socketService} from "services";
import {socialStore} from "stores";

export const sendChatMsgReceiver = () => {
  socketService.socket.on("sendChatMsgReceiver", (params) => {
    const {sender, text, date} = params;

    socialStore.update((store) => {
      store
        .friends
        .find((friend) => friend.username === sender)
        .messages
        .push({username: sender, text, date});

      return store;
    });
  });
};
