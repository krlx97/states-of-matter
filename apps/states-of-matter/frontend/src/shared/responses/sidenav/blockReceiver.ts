import {socketService} from "services";
import {accountStore} from "stores";

const blockReceiver = (): void => {
  socketService.socket.on("blockReceiver", (params): void => {
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
  });
};

export {blockReceiver};
