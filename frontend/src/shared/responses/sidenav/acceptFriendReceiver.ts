import {socketService} from "services";
import {accountStore} from "stores";

const acceptFriendReceiver = (): void => {
  socketService.socket.on("acceptFriendReceiver", (params): void => {
    const {name, avatarId, status} = params;
    const messages = [];

    accountStore.update((store) => {
      store.social.friends.push({name, status, avatarId, messages});
      return store;
    });
  });
};

export {acceptFriendReceiver};
