import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {playerStore} from "stores";

const endGame = (): void => {
  const {socket} = socketService;

  socket.on("endGame", (): void => {
    playerStore.update((player) => {
      player.status = PlayerStatus.ONLINE;
      player.gameId = 0;
      return player;
    });

    socket.emit("updateStatus");
  });
};

export {endGame};
