import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import type {Game} from "models/data";

const gameStore: Writable<Game> = writable({
  gameId: 0,
  currentPlayer: "",
  player: {
    username: "",
    hero: {
      id: 0,
      health: 0,
      maxHealth: 0,
      damage: 0,
      mana: 0,
      maxMana: 0,
      passive: 0
    },
    fields: {
      magic: undefined,
      minionA: undefined,
      minionB: undefined,
      minionC: undefined,
      minionD: undefined,
      trap: undefined
    },
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
      damage: 0,
      mana: 0,
      maxMana: 0,
      passive: 0
    },
    fields: {
      magic: undefined,
      minionA: undefined,
      minionB: undefined,
      minionC: undefined,
      minionD: undefined,
      trap: undefined
    },
    deck: 0,
    hand: 0,
    graveyard: []
  }
});

export default gameStore;
