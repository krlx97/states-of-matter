import {writable} from "svelte/store";

interface Notification {
  id: number;
  msg: string;
}

type Notifications = Array<Notification>;

const notificationsStore = writable<Notifications>([]);

export {notificationsStore};
