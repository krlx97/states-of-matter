import {writable} from "svelte/store";
import type {GameFrontend} from "@som/shared/types/frontend";

export const gameStore = writable<GameFrontend>({
  gameId: 0,
  currentPlayer: "",
  currentTurn: 0,
  battleLogs: [],
  selectedSkins: {
    player: [],
    opponent: []
  },
  player: {
    name: "",
    hero: {
      id: 0,
      type: 0,
      name: "",
      klass: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      ability: 0
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: undefined,
    deck: [],
    hand: [],
    graveyard: []
  },
  opponent: {
    name: "",
    hero: {
      id: 0,
      type: 0,
      name: "",
      klass: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      ability: 0
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: false,
    deck: 0,
    hand: 0,
    graveyard: []
  }
});
