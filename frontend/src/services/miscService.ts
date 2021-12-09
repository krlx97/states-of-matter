import {modalStore, notificationStore} from "stores/view";

const miscService = {
  showNotification (msg: string): void {
    notificationStore.update((store) => {
      const id = store.length;

      store.push({id, msg});

      return store;
    });

    setTimeout((): void => {
      notificationStore.update((store) => {
        const id = store.length;

        const notification = store.find((notification) => notification.id === id);
        const i = store.indexOf(notification);

        store.splice(i, 1);

        return store;
      });
    }, 10000);
  },

  openModal (name: string, data: any = {}): void {
    modalStore.update((store) => {
      store.current = name;
      store.data = data;
      store.list[name] = true;
  
      return store;
    });
  },

  closeModal (): void {
    modalStore.update((store) => {
      store.list[store.current] = false;
      store.current = "";
      store.data = {};
  
      return store;
    });
  }
};

export default miscService;