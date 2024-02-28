import {get} from "svelte/store";
import {socketService, soundService} from "services";
import {chatStore, lobbyStore, playerStore} from "stores";

const sendChatMsgReceiver = (): void => {
  socketService.socket.on("sendChatMessageReceiver", (params): void => {
    const {sender, text, date} = params;
    const chat = get(chatStore);
    const name = sender;

    lobbyStore.update((store) => {
      store.messages.push({name: sender, text, date});
      return store;
    });

    // playerStore.update((store) => {
    //   const friend = store
    //     .social
    //     .friends
    //     .find((friend): boolean => friend.name === sender);

    //   if (!friend) {
    //     return store;
    //   }

    //   const {chat} = friend;

    //   if (chat.lastSender === sender) {
    //     chat.unseen += 1;
    //   } else {
    //     chat.lastSender = sender;
    //     chat.unseen = 1;
    //   }

    //   chat.messages.push({name, text, date});

    //   return store;
    // });

    // if (chat.name === sender) {
    //   chatStore.update((store) => {
    //     // find a better way to update chat?
    //     // now it works in real time and has no double-message issues.
    //     return store;
    //   });

    //   if (chat.isOpen) {
    //     socketService.socket.emit("readChatMessages", {name});
    //   }
    // }

    soundService.play("message");
  });
};

export {sendChatMsgReceiver};
