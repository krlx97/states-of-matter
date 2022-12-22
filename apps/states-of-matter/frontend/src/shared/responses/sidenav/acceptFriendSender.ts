import {socketService} from "services";
import {accountStore, playerStore, socialStore} from "stores";

export const acceptFriendSender = () => {
  const {socket} = socketService;

  socket.on("acceptFriendSender", (params) => {
    const {username, avatarId, status} = params;
    const messages = [];

    accountStore.update((store) => {
      const {friends, requests} = store.social;
      const i = requests.indexOf(username);

      friends.push({username, status, avatarId, messages});
      requests.splice(i, 1);

      return store;
    });

    // playerStore.update((store) => {
    //   const {friends, requests} = store.social;
    //   const i = requests.indexOf(username);

    //   friends.push(username);
    //   requests.splice(i, 1);

    //   return store;
    // });

    // socialStore.update((store) => {
    //   store.friends.push({username, status, avatarId, messages});
    //   return store;
    // });
  });
};
