import {socketService} from "services";
import {playerStore} from "stores";

const removeFriendReceiver = (): void => {
  socketService.socket.on("removeFriendReceiver", (params): void => {
    const {name} = params;

    playerStore.update((store) => {
      if (store.mutualFriends.includes(name)) {
        store.mutualFriends.splice(store.mutualFriends.indexOf(name), 1);
      }

      return store;
    });
  });
};

export {removeFriendReceiver};
