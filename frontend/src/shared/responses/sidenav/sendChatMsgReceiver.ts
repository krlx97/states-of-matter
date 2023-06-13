import {socketService} from "services";
import {accountStore} from "stores";

const sendChatMsgReceiver = (): void => {
  socketService.socket.on("sendChatMsgReceiver", (params): void => {
    const {sender, text, date} = params;

    accountStore.update((store) => {
      store
        .social
        .friends
        .find((friend) => friend.name === sender)
        .messages
        .push({name: sender, text, date});

      return store;
    });
  });
};

export {sendChatMsgReceiver};
