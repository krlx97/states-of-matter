import {socketService} from "services";
import {accountStore} from "stores";

const setAvatarReceiver = (): void => {
  socketService.socket.on("setAvatarReceiver", (params): void => {
    const {name, avatarId} = params;

    accountStore.update((store) => {
      const friend = store.social.friends.find((friend) => friend.name === name);
      friend.avatarId = avatarId;
      return store;
    });
  });
};

export {setAvatarReceiver};
