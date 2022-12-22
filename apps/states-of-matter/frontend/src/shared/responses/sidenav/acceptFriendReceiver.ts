import {socketService} from "services";
import {accountStore, playerStore, socialStore} from "stores";

export const acceptFriendReceiver = () => {
  const {socket} = socketService;

  socket.on("acceptFriendReceiver", (params) => {
    const {username, avatarId, status} = params;
    const messages = [];

    // playerStore.update((store) => {
    //   store.social.friends.push(username);
    //   return store;
    // });

    accountStore.update((store) => {
      store.social.friends.push({username, status, avatarId, messages});
      return store;
    });
  });
};
