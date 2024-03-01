import {writable} from "svelte/store";

interface Notification {
  id: number;
  color: "primary" | "success" | "warn";
  message: string;
}

type Notifications = Array<Notification>;

const notificationsStore = writable<Notifications>([]);

export {notificationsStore};
