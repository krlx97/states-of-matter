import {socketService} from "services";
import {playerStore} from "stores";

const acceptFriendSender = (): void => {
  socketService.socket.on("acceptFriendSender", (params): void => {
    const {
      name,
      avatarId,
      bannerId,
      experience,
      level,
      elo,
      status,
      games,
      lastSender
    } = params;

    playerStore.update((store) => {
      const {friends, requests} = store.social;
      const i = requests.indexOf(name);

      friends.push({
        name,
        avatarId,
        bannerId,
        experience,
        level,
        elo,
        status,
        games,
        chat: {
          lastSender,
          unseen: 0,
          messages: []
        }
      });

      requests.splice(i, 1);

      return store;
    });
  });
};

export {acceptFriendSender};
