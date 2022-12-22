import {socketService} from "services";
import {accountStore, playerStore} from "stores";

export const addFriend = () => {
  const {socket} = socketService;

  socket.on("addFriend", (params) => {
    accountStore.update((store) => {
      store.social.requests.push(params.username);
      return store;
    });
    // playerStore.update((player) => {
    //   player.social.requests.push(params.username);
    //   return player;
    // });
  });
};
