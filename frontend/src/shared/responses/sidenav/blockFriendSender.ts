import {modalService, socketService} from "services";
import {accountStore} from "stores";

const blockFriendSender = (): void => {
  socketService.socket.on("blockFriendSender", (params): void => {
    const {name} = params;

    accountStore.update((store) => {
      const {chat, friends, blocked} = store.social;
      const friend = friends.find((friend) => friend.name === name);
      const i = friends.indexOf(friend);

      friends.splice(i, 1);
      blocked.push(name);

      if (chat.name === name) {
        chat.isOpen = false;
      }

      return store;
    });

    modalService.close();
  });
};

export {blockFriendSender};
