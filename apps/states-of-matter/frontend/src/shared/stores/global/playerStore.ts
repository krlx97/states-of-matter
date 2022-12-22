import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {PlayerFrontend} from "@som/shared/types/frontend";

const playerStore = writable<PlayerFrontend>({
  name: "",
  status: PlayerStatus.OFFLINE,
  xp: 0,
  lv: 1,
  deckId: 0,
  lobbyId: 0,
  gameId: 0,
  games: {
    casual: {won: 0, lost: 0},
    ranked: {won: 0, lost: 0, elo: 1000}
  },
  decks: [],
  selectedSkins: new Map()
});

export {playerStore};
