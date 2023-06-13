import {socketService} from "services";
import {playerStore} from "stores";

const levelUp = (): void => {
  const {socket} = socketService;

  socket.on("levelUp", (params): void => {
    const {xp} = params;

    playerStore.update((player) => {
      player.experience = xp;
      return player;
    });
  });
};

export {levelUp};
