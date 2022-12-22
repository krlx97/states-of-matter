import {socketService} from "services";
import {accountStore} from "stores";

const unblock = (): void => {
  socketService.socket.on("unblock", (params): void => {
    accountStore.update((store) => {
      const {blocked} = store.social;
      const i = blocked.indexOf(params.friendname);

      blocked.splice(i, 1);

      return store;
    });
  });
};

export {unblock};
