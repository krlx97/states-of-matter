import {socketService} from "services";
import {playerStore} from "stores";

const addFriendReceiver = (): void => {
  socketService.socket.on("addFriendReceiver", (params): void => {
    playerStore.update((store) => {
      store.mutualFriends.push(params.name);
      return store;
    });
  });
};

export {addFriendReceiver};
