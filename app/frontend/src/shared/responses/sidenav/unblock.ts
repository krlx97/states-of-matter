import {socketService} from "services";
import {playerStore} from "stores";

export const unblock = () => {
  const {socket} = socketService;

  socket.on("unblock", (params) => {
    playerStore.update((player) => {
      const {blocked} = player.social;
      const i = blocked.indexOf(params.friendname);

      blocked.splice(i, 1);

      return player;
    });
  });
};
