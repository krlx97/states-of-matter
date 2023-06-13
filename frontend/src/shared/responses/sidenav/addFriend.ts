import {socketService} from "services";
import {accountStore} from "stores";

const addFriend = (): void => {
  socketService.socket.on("addFriend", (params): void => {
    accountStore.update((store) => {
      store.social.requests.push(params.name);
      return store;
    });
  });
};

export {addFriend};
