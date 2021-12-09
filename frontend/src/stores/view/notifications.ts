import {Writable, writable} from "svelte/store"

interface Notification {
  id: number;
  msg: string;
}

const notificationsStore: Writable<Array<Notification>> = writable([]);

export default notificationsStore;