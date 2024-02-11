import {socketService} from "services";
import {playerStore} from "stores";

const unblockFriend = (): void => {
  socketService.socket.on("unblockFriend", (params): void => {
    playerStore.update((store) => {
      const {blocked} = store.social;
      const i = blocked.indexOf(params.name);

      blocked.splice(i, 1);

      return store;
    });
  });
};

export {unblockFriend};
