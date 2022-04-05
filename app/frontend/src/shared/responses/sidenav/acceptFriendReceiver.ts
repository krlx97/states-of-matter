import {socketService} from "services";
import {playerStore, socialStore} from "stores";

export const acceptFriendReceiver = () => {
  const {socket} = socketService;

  socket.on("acceptFriendReceiver", (params) => {
    const {username, avatarId, status} = params;
    const messages = [];

    playerStore.update((store) => {
      store.social.friends.push(username);
      return store;
    });

    socialStore.update((store) => {
      store.friends.push({username, status, avatarId, messages});
      return store;
    });
  });
};
