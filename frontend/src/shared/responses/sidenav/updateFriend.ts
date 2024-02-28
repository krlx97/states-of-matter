import {socketService} from "services";
import {playerStore} from "stores";

const updateFriend = (): void => {
  socketService.socket.on("updateFriend", (params): void => {
    const {name} = params;

    playerStore.update((store) => {
      const friend = store.friends.find((friend): boolean => friend.name === name);

      if (!friend) {
        return store;
      }

      if (params.avatarId) {
        friend.avatarId = params.avatarId;
      }

      if (params.bannerId) {
        friend.bannerId = params.bannerId;
      }

      if (params.elo !== undefined) {
        friend.elo = params.elo;
      }

      if (params.experience !== undefined) {
        friend.experience = params.experience;
      }

      if (params.level !== undefined) {
        friend.level = params.level;
      }

      if (params.status !== undefined) {
        friend.status = params.status;
      }

      if (params.games) {
        friend.games = params.games;
      }

      return store;
    });
  });
};

export {updateFriend};
