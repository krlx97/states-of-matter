import {socketService} from "services";
import {accountStore, playerStore} from "stores";

export const setAvatarSender = () => {
  const {socket} = socketService;

  socket.on("setAvatarSender", (params) => {
    accountStore.update((store) => {
      store.profile.avatarId = params.avatarId;
      return store;
    });
    // playerStore.update((player) => {
    //   player.avatarId = params.avatarId;
    //   return player;
    // });
  });
};
