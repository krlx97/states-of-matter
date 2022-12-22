import {socketService} from "services";
import {accountStore, socialStore} from "stores";

export const setAvatarReceiver = () => {
  socketService.socket.on("setAvatarReceiver", (params) => {
    const {username, avatarId} = params;

    accountStore.update((store) => {
      const friend = store.social.friends.find((friend) => friend.username === username);
      friend.avatarId = avatarId;
      return store;
    });

    // socialStore.update((store) => {
    //   const friend = store.friends.find((friend) => friend.username === username);
    //   friend.avatarId = avatarId;
    //   return store;
    // });
  });
};
