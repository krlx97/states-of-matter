import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {PlayerView} from "@som/shared/types/frontend";

const playerStore = writable<PlayerView>({
  name: "",
  experience: 0,
  level: 1,
  elo: 500,
  joinedAt: 0,
  status: PlayerStatus.OFFLINE,
  queueId: 0,
  deckId: 0,
  lobbyId: 0,
  gamePopupId: 0,
  gameId: 0,
  games: {
    casual: {won: 0, lost: 0},
    ranked: {won: 0, lost: 0}
  },
  decks: [],
  skins: [],
  tutorial: {
    deckBuilder: false,
    game: false,
    play: false,
    wallet: false
  }
});

export {playerStore};
