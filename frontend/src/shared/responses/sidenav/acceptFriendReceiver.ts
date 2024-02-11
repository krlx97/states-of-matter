import {socketService} from "services";
import {playerStore} from "stores";

const acceptFriendReceiver = (): void => {
  socketService.socket.on("acceptFriendReceiver", (params): void => {
    const {
      name,
      avatarId,
      bannerId,
      experience,
      level,
      elo,
      status,
      games
    } = params;

    playerStore.update((store) => {
      store.social.friends.push({
        name,
        avatarId,
        bannerId,
        experience,
        level,
        elo,
        status,
        games,
        chat: {
          lastSender: name,
          unseen: 0,
          messages: []
        }
      });
      return store;
    });
  });
};

export {acceptFriendReceiver};
