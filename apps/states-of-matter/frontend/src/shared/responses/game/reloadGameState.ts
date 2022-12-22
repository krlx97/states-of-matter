import {socketService} from "services";
import {gameStore} from "stores";

export const reloadGameState = (): void => {
  const {socket} = socketService;

  socket.on("reloadGameState", (params): void => {
    gameStore.set(params.game);
  });
};
