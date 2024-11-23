import {get} from "svelte/store";
import {socketService, soundService} from "services";
import {lobbyStore, playerStore} from "stores";

const sendChatMsgReceiver = (): void => {
  socketService.socket.on("sendChatMessageReceiver", (params): void => {
    const {sender, text, date} = params;
    const name = sender;

    lobbyStore.update((store) => {
      store.messages.push({name: sender, text, date});
      return store;
    });

    soundService.play("message");
  });
};

export {sendChatMsgReceiver};
