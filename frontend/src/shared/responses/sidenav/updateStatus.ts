import {socketService} from "services";
import {accountStore} from "stores";

const updateStatus = (): void => {
  socketService.socket.on("updateFriend", (params): void => {
    const {name, status} = params;

    accountStore.update((store) => {
      const {friends} = store.social;
      const friend = friends.find((friend) => friend.name === name);

      friend.status = status;

      return store;
    });
  });
};

export {updateStatus};
