import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import type {Lobby} from "models/data";

const lobbyStore: Writable<Lobby> = writable({
  lobbyId: 0,
  host: {
    username: "",
    avatarId: 0
  },
  challengee: {
    username: "",
    avatarId: 0
  }
});

export default lobbyStore;
