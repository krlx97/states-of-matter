import {notificationsStore} from "stores";

class NotificationService {
  show (msg: string): void {
    notificationsStore.update((store) => {
      const id = store.length;
      store.push({id, msg});
      return store;
    });

    setTimeout((): void => {
      notificationsStore.update((store) => {
        const id = store.length;
        const notification = store.find((notification) => notification.id === id);
        const i = store.indexOf(notification);

        store.splice(i, 1);

        return store;
      });
    }, 10000);
  }
}

export {NotificationService};
