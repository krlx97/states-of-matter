import {socketService} from "services";
import {accountStore, socialStore} from "stores";

export const updateFriend = () => {
  socketService.socket.on("updateStatus", (params) => {
    const {username, status} = params;

    accountStore.update((store) => {
      const {friends} = store.social;
      const friend = friends.find((friend) => friend.username === username);

      friend.status = status;

      return store;
    });

    // socialStore.update((store) => {
    //   const {friends} = store;
    //   const friend = friends.find((friend) => friend.username === username);

    //   friend.status = status;

    //   return store;
    // });
  });
};
