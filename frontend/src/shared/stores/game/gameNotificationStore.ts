import {writable} from "svelte/store";

interface GameNotificationStore {
  card: any;
  username: string;
  text: string;
}

const gameNotificationStore = writable<GameNotificationStore>({
  card: undefined,
  username: "",
  text: ""
});

export {gameNotificationStore};
