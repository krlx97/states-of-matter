import {miscService, socketService} from "services";
import {playerStore, socialStore} from "stores";

export const blockSender = () => {
  const {socket} = socketService;

  socket.on("blockSender", (params) => {
    const {username} = params;

    playerStore.update((store) => {
      const {friends, blocked} = store.social;
      const i = friends.indexOf(username);

      friends.splice(i, 1);
      blocked.push(username);

      return store;
    });

    socialStore.update((store) => {
      const {chat, friends} = store;
      const friend = friends.find((friend) => friend.username === username);
      const i = friends.indexOf(friend);

      friends.splice(i, 1);

      if (chat.username === username) { chat.isOpen = false; }

      return store;
    });

    miscService.closeModal();
  });
};
