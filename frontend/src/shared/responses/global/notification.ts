import {socketService, soundService} from "services";
import {notificationsStore} from "stores";

const notification = (): void => {
  socketService.socket.on("notification", (params): void => {
    const {color, message} = params;

    notificationsStore.update((store) => {
      const id = Math.random();
      store.push({id, color, message});
      return store;
    });

    soundService.play("notification");
  });
};

export {notification};
