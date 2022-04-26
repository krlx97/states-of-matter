import {writable} from "svelte/store";
import type {GameFE} from "@som/shared/interfaces/client";

export const gameStore = writable<GameFE>({
  gameId: 0,
  currentPlayer: "",
  player: {
    username: "",
    hero: {
      id: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      effects: []
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: undefined,
    deck: [],
    hand: [],
    graveyard: []
  },
  opponent: {
    username: "",
    hero: {
      id: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      effects: []
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: undefined,
    deck: 0,
    hand: 0,
    graveyard: []
  }
});
