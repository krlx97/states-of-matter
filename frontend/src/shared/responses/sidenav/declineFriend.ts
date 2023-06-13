import {socketService} from "services";
import {accountStore} from "stores";

const declineFriend = (): void => {
  socketService.socket.on("declineFriend", (params): void => {
    accountStore.update((store) => {
      const {requests} = store.social;
      const i = requests.indexOf(params.name);

      requests.splice(i, 1);

      return store;
    });
  });
};

export {declineFriend};
