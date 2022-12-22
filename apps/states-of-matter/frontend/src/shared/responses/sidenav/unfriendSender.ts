import {miscService, socketService} from "services";
import {accountStore, playerStore, socialStore} from "stores";

export const unfriendSender = () => {
  socketService.socket.on("unfriendSender", (params) => {
    const {username} = params;

    accountStore.update((store) => {
      const {chat, friends} = store.social;
      const friend = friends.find((friend) => friend.username === username);
      const i = friends.indexOf(friend);

      friends.splice(i, 1);

      if (chat.username === username) {
        chat.isOpen = false;
      }

      return store;
    });

    // playerStore.update((store) => {
    //   const {friends} = store.social;
    //   const i = friends.indexOf(username);

    //   friends.splice(i, 1);

    //   return store;
    // });

    // socialStore.update((store) => {
    //   const {chat, friends} = store;
    //   const friend = friends.find((friend) => friend.username === username);
    //   const i = friends.indexOf(friend);

    //   friends.splice(i, 1);

    //   if (chat.username === username) { chat.isOpen = false; }

    //   return store;
    // });

    miscService.closeModal();
  });
};
