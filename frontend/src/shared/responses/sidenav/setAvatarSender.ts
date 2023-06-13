import {socketService} from "services";
import {accountStore} from "stores";

const setAvatarSender = (): void => {
  socketService.socket.on("setAvatarSender", (params): void => {
    accountStore.update((store) => {
      store.avatarId = params.avatarId;
      return store;
    });
  });
};

export {setAvatarSender};
