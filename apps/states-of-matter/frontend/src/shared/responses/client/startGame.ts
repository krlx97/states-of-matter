import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {gameStore, playerStore} from "stores";

export const startGame = () => {
  const {socket} = socketService;

  socket.on("startGame", (params) => {
    playerStore.update((player) => {
      player.status = PlayerStatus.INGAME;
      return player;
    });
    gameStore.set(params.game);
    socket.emit("updateStatus");
  });
};
