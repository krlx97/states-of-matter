import {writable, type Writable} from "svelte/store";

interface Notification {
  id: number;
  msg: string;
}

type Notifications = Array<Notification>;

export const notificationsStore: Writable<Notifications> = writable([]);
