import {socketService} from "services";
import {accountStore} from "stores";

const sendChatMsgSender = (): void => {
  socketService.socket.on("sendChatMsgSender", (params): void => {
    const {sender, receiver, text, date} = params;

    accountStore.update((store) => {
      store
        .social
        .friends
        .find((friend) => friend.name === receiver)
        .messages
        .push({name: sender, text, date});

      return store;
    });
  });
};

export {sendChatMsgSender};
