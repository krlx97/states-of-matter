import {modalService, socketService} from "services";
import {accountStore} from "stores";

const removeFriendSender = (): void => {
  socketService.socket.on("removeFriendSender", (params): void => {
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

    modalService.close();
  });
};

export {removeFriendSender};
