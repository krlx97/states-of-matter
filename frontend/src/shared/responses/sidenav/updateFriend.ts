import {socketService} from "services";
import {playerStore} from "stores";

const updateFriend = (): void => {
  socketService.socket.on("updateFriend", (params): void => {
    const {name} = params;

    playerStore.update((store) => {
      const {friends} = store.social;
      const friend = friends.find((friend): boolean => friend.name === name);

      if (!friend) {
        return store;
      }

      if (params.avatarId) {
        friend.avatarId = params.avatarId;
      }

      if (params.bannerId) {
        friend.bannerId = params.bannerId;
      }

      if (params.elo) {
        friend.elo = params.elo;
      }

      if (params.experience) {
        friend.experience = params.experience;
      }

      if (params.level) {
        friend.level = params.level;
      }

      if (params.status) {
        friend.status = params.status;
      }

      return store;
    });
  });
};

export {updateFriend};
