import {socketService} from "services";
import {gameStore} from "stores";

const reloadGameState = (): void => {
  socketService.socket.on("reloadGameState", (params): void => {
    gameStore.set(params.game);
  });
};

export {reloadGameState};
