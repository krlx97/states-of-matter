import {socketService} from "services";
import {lobbyStore} from "stores";

const sendChatMsgSender = (): void => {
  socketService.socket.on("sendChatMessageSender", (params): void => {
    const {sender, receiver, text, date} = params;
    const name = sender;

    lobbyStore.update((store) => {
      store.messages.push({name, text, date});

      if (store.messages.length > 10) {
        store.messages.shift();
      }

      return store;
    });
  });
};

export {sendChatMsgSender};
