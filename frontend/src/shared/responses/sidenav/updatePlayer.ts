import {socketService} from "services";
import {playerStore} from "stores";

const updatePlayer = (): void => {
  socketService.socket.on("updatePlayer", (params): void => {
    playerStore.update((store) => {
      if (params.avatarId) {
        store.avatarId = params.avatarId;
      }

      if (params.bannerId) {
        store.bannerId = params.bannerId;
      }

      return store;
    });
  });
};

export {updatePlayer};
