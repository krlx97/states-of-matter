import {writable} from "svelte/store";

const modalStore = writable({
  component: undefined,
  data: undefined,
  isVisible: false
});

export {modalStore};
