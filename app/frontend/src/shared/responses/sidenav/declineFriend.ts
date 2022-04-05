import {socketService} from "services";
import {playerStore} from "stores";

export const declineFriend = () => {
  const {socket} = socketService;

  socket.on("declineFriend", (params) => {
    playerStore.update((player) => {
      const {requests} = player.social;
      const i = requests.indexOf(params.username);

      requests.splice(i, 1);

      return player;
    });
  });
};
