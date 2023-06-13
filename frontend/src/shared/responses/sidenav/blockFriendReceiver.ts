import {socketService} from "services";
import {accountStore} from "stores";

const blockFriendReceiver = (): void => {
  socketService.socket.on("blockFriendReceiver", (params): void => {
    const {name} = params;

    accountStore.update((store) => {
      const {chat, friends} = store.social;
      const friend = friends.find((friend) => friend.name === name);
      const i = friends.indexOf(friend);

      friends.splice(i, 1);

      if (chat.name === name) {
        chat.isOpen = false;
      }

      return store;
    });
  });
};

export {blockFriendReceiver};
