import {socketService} from "services";
import {playerStore} from "stores";

export const levelUp = (): void => {
  const {socket} = socketService;

  socket.on("levelUp", (params): void => {
    const {xp} = params;

    playerStore.update((player) => {
      player.xp = xp;
      return player;
    });
  });
};
