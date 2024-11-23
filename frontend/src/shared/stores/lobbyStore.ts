import {writable} from "svelte/store";
import type {LobbyView} from "@som/shared/types/views";

const lobbyStore = writable<LobbyView>({
  id: 0,
  host: {
    name: "",
    experience: 0,
    level: 0,
    elo: 0,
    avatarId: 0,
    bannerId: 0,
    games: {
      casual: {won: 0, lost: 0},
      ranked: {won: 0, lost: 0}
    }
  },
  challengee: {
    name: "",
    experience: 0,
    level: 0,
    elo: 0,
    avatarId: 0,
    bannerId: 0,
    games: {
      casual: {won: 0, lost: 0},
      ranked: {won: 0, lost: 0}
    }
  },
  messages: [],
});

export {lobbyStore};
