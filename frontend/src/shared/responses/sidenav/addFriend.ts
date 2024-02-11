import {socketService} from "services";
import {playerStore} from "stores";

const addFriend = (): void => {
  socketService.socket.on("addFriend", (params): void => {
    playerStore.update((store) => {
      store.social.requests.push(params.name);
      return store;
    });
  });
};

export {addFriend};
