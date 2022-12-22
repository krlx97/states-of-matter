import {writable} from "svelte/store";
import type {LobbyFrontend} from "@som/shared/types/frontend";

const lobbyStore = writable<LobbyFrontend>({
  lobbyId: 0,
  host: {
    name: "",
    socketId: "",
    avatarId: 0
  },
  challengee: {
    name: "",
    socketId: "",
    avatarId: 0
  }
});

export {lobbyStore};
