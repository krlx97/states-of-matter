import {socketService} from "services";
import {playerStore} from "stores";

export const addFriend = () => {
  const {socket} = socketService;

  socket.on("addFriend", (params) => {
    playerStore.update((player) => {
      player.social.requests.push(params.username);
      return player;
    });
  });
};
