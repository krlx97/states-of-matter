import {socketService} from "services";
import {playerStore} from "stores";

export const deselectSkin = () => {
  const {socket} = socketService;

  socket.on("deselectSkin", (params) => {
    const {id} = params;

    playerStore.update((player) => {
      player.selectedSkins.set(id, 0);

      return player;
    });
  });
};
