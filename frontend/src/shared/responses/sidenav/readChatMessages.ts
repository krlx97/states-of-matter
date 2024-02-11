import {socketService} from "services";
import {playerStore} from "stores";

const readChatMessages = (): void => {
  socketService.socket.on("readChatMessages", (params): void => {
    const {name} = params;

    playerStore.update((store) => {
      const {friends} = store.social;
      const friend = friends.find((friend): boolean => friend.name === name);

      if (!friend) {
        return store;
      }

      friend.chat.unseen = 0;

      return store;
    });
  });
};

export {readChatMessages};
