import {modalStore} from "stores";

const open = (component: any, data: any = {}): void => {
  modalStore.update((store) => {
    store.component = component;
    store.data = data;
    store.isVisible = true;

    return store;
  });
};

const close = (): void => {
  modalStore.update((store) => {
    store.isVisible = false;
    store.component = undefined;
    store.data = undefined;

    return store;
  });
};

const modalService = {open, close};

export {modalService};
