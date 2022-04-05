import {modalStore, notificationsStore} from "stores";

export class MiscService {
  showNotification (msg: string): void {
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

  openModal (name: string, data: any = {}): void {
    modalStore.update((store) => {
      store.current = name;
      store.data = data;
      store.list[name] = true;

      return store;
    });
  }

  closeModal (): void {
    modalStore.update((store) => {
      store.list[store.current] = false;
      store.current = "";
      store.data = {};

      return store;
    });
  }
}
