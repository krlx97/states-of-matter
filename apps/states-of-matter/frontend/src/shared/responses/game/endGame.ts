import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {playerStore} from "stores";

export const endGame = () => {
  const {socket} = socketService;

  socket.on("endGame", () => {
    playerStore.update((player) => {
      player.gameId = 0;
      player.status = PlayerStatus.ONLINE;
      return player;
    });

    socket.emit("updateStatus");
  });
};
