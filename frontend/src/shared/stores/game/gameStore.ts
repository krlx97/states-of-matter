import {writable} from "svelte/store";
import {GameType} from "@som/shared/enums";
import type {GameView} from "@som/shared/types/frontend";

export const gameStore = writable<GameView>({
  id: 0,
  type: GameType.CUSTOM,
  currentPlayer: "",
  currentTurn: 0,
  gameLogs: [],
  player: {
    name: "",
    hero: {
      gid: 0,
      id: 0,
      type: 0,
      name: "",
      klass: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      ability: 0
      ,effect: 0,
      buffs: [],
      debuffs: []
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: undefined,
    deck: 0,
    hand: [],
    graveyard: [],
    selectedSkins: {
      avatars: [],
      border: 0,
      back: 0
    }
  },
  opponent: {
    name: "",
    hero: {
      gid: 0,
      id: 0,
      type: 0,
      name: "",
      klass: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      ability: 0
      ,effect: 0,
      buffs: [],
      debuffs: []
    },
    minion: {a: undefined, b: undefined, c: undefined, d: undefined},
    trap: false,
    deck: 0,
    hand: 0,
    graveyard: [],
    selectedSkins: {
      avatars: [],
      border: 0,
      back: 0
    }
  }
});
