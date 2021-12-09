import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import type {Game} from "models/data";

const gameStore: Writable<Game> = writable({
  gameId: 0,
  playerA: {
    username: "",
    hero: {
      id: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      passive: 0
    },
    fields: {
      magic: {id: 0, gid: 0},
      minionA: {id: 0, gid: 0},
      minionB: {id: 0, gid: 0},
      minionC: {id: 0, gid: 0},
      minionD: {id: 0, gid: 0},
      trap: {id: 0, gid: 0}
    },
    deck: [],
    hand: [],
    graveyard: []
  },
  playerB: {
    username: "",
    hero: {
      id: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      passive: 0
    },
    fields: {
      magic: {id: 0, gid: 0},
      minionA: {id: 0, gid: 0},
      minionB: {id: 0, gid: 0},
      minionC: {id: 0, gid: 0},
      minionD: {id: 0, gid: 0},
      trap: {id: 0, gid: 0}
    },
    deck: [],
    hand: [],
    graveyard: []
  }
});

export default gameStore;
