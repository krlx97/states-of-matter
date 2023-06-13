import {modalStore} from "stores";

class ModalService {
  open (component: any, data: any = {}): void {
    modalStore.update((store) => {
      store.component = component;
      store.data = data;
      store.isVisible = true;

      return store;
    });
  }

  close (): void {
    modalStore.update((store) => {
      store.isVisible = false;
      store.component = undefined;
      store.data = undefined;

      return store;
    });
  }
}

export {ModalService};
