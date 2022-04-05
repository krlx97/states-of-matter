import {socketService} from "services";
import {playerStore} from "stores";

export const setAvatarSender = () => {
  const {socket} = socketService;

  socket.on("setAvatarSender", (params) => {
    playerStore.update((player) => {
      player.avatarId = params.avatarId;
      return player;
    });
  });
};
