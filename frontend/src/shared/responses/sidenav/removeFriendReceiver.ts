import {get} from "svelte/store";
import {socketService} from "services";
import {chatStore, playerStore} from "stores";

const removeFriendReceiver = (): void => {
  socketService.socket.on("removeFriendReceiver", (params): void => {
    const {name} = params;

    playerStore.update((store) => {
      const {friends} = store.social;
      const friend = friends.find((friend): boolean => friend.name === name);

      if (!friend) {
        return store;
      }

      const i = friends.indexOf(friend);

      friends.splice(i, 1);

      return store;
    });

    if (get(chatStore).name === name) {
      chatStore.update((store) => {
        store = {
          name: "",
          isOpen: false,
          messages: []
        };

        return store;
      });
    }
  });
};

export {removeFriendReceiver};
