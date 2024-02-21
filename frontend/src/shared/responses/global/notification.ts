import {socketService, soundService} from "services";
import {notificationsStore} from "stores";

const notification = (): void => {
  socketService.socket.on("notification", (params): void => {
    const {color, message} = params;

    const id = Math.random();

    notificationsStore.update((store) => {
      store.push({id, color, message});
      return store;
    });

    setTimeout((): void => {
      notificationsStore.update((store) => {
        const n = store.find((n) => n.id === id);

        if (!n) { // notification closed by user
          return store;
        }

        store.splice(store.indexOf(n), 1);
        return store;
      });
    }, 6000);

    soundService.play("notification");
  });
};

export {notification};
