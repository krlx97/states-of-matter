import {socketService} from "services";
import {socialStore} from "stores";

export const updateFriend = () => {
  socketService.socket.on("updateStatus", (params) => {
    const {username, status} = params;

    socialStore.update((store) => {
      const {friends} = store;
      const friend = friends.find((friend) => friend.username === username);

      friend.status = status;

      return store;
    });
  });
};
