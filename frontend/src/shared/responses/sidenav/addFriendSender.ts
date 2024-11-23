import {socketService} from "services";
import {playerStore} from "stores";

const addFriendSender = (): void => {
  socketService.socket.on("addFriendSender", (params): void => {
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
      store.friends.push({
        name,
        avatarId,
        bannerId,
        experience,
        level,
        elo,
        status,
        games
      });

      if (params.isMutual) {
        store.mutualFriends.push(params.name);
      }

      return store;
    });
  });
};

export {addFriendSender};
