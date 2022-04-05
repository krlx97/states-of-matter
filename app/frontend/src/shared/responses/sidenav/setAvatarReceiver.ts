import {socketService} from "services";
import {socialStore} from "stores";

export const setAvatarReceiver = () => {
  socketService.socket.on("setAvatarReceiver", (params) => {
    const {username, avatarId} = params;

    socialStore.update((store) => {
      const friend = store.friends.find((friend) => friend.username === username);
      friend.avatarId = avatarId;
      return store;
    });
  });
};
