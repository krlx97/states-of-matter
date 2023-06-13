import {socketService} from "services";
import {accountStore} from "stores";

const acceptFriendSender = (): void => {
  socketService.socket.on("acceptFriendSender", (params): void => {
    const {name, avatarId, status} = params;
    const messages = [];

    accountStore.update((store) => {
      const {friends, requests} = store.social;
      const i = requests.indexOf(name);

      friends.push({name, status, avatarId, messages});
      requests.splice(i, 1);

      return store;
    });
  });
};

export {acceptFriendSender};
