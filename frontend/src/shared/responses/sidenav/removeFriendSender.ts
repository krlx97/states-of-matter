import {get} from "svelte/store";
import {modalService, socketService} from "services";
import {chatStore, playerStore} from "stores";

const removeFriendSender = (): void => {
  socketService.socket.on("removeFriendSender", (params): void => {
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

    modalService.close();
  });
};

export {removeFriendSender};
