import {writable} from "svelte/store";
import type {LobbyView} from "@som/shared/types/frontend";

const lobbyStore = writable<LobbyView>({
  id: 0,
  host: {
    name: "",
    avatarId: 0
  },
  challengee: {
    name: "",
    avatarId: 0
  }
});

export {lobbyStore};
