import {socketService} from "services";
import {accountStore, playerStore} from "stores";

export const declineFriend = () => {
  const {socket} = socketService;

  socket.on("declineFriend", (params) => {
    accountStore.update((store) => {
      const {requests} = store.social;
      const i = requests.indexOf(params.username);

      requests.splice(i, 1);

      return store;
    });

    // playerStore.update((player) => {
    //   const {requests} = player.social;
    //   const i = requests.indexOf(params.username);

    //   requests.splice(i, 1);

    //   return player;
    // });
  });
};
