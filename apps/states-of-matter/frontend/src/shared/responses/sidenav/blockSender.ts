import {miscService, socketService} from "services";
import {accountStore} from "stores";

const blockSender = (): void => {
  socketService.socket.on("blockSender", (params): void => {
    const {username} = params;

    accountStore.update((store) => {
      const {chat, friends, blocked} = store.social;
      const friend = friends.find((friend) => friend.username === username);
      const i = friends.indexOf(friend);

      friends.splice(i, 1);
      blocked.push(username);

      if (chat.username === username) {
        chat.isOpen = false;
      }

      return store;
    });

    miscService.closeModal();
  });
};

export {blockSender};
