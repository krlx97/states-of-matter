import {get} from "svelte/store";
import {socketService} from "services";
import {chatStore, lobbyStore, playerStore} from "stores";

const sendChatMsgSender = (): void => {
  socketService.socket.on("sendChatMessageSender", (params): void => {
    const {sender, receiver, text, date} = params;
    const name = sender;

    lobbyStore.update((store) => {
      store.messages.push({name: sender, text, date});
      if (store.messages.length > 10) {
        store.messages.shift();
      }
    return store;
    });
    // playerStore.update((store) => {
    //   const friend = store
    //     .social
    //     .friends
    //     .find((friend): boolean => friend.name === receiver);

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

    // if (get(chatStore).name === receiver) {
    //   chatStore.update((store) => {
    //     // find a better way to update chat?
    //     // now it works in real time and has no double-message issues.
    //     return store;
    //   });
    // }
  });
};

export {sendChatMsgSender};
