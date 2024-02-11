import {writable} from "svelte/store";
import type { GameTrapCard } from "@som/shared/types/mongo";

interface NodeStore {
  player: {
    a: HTMLElement,
    aDamage: HTMLElement,
    b: HTMLElement,
    bDamage: HTMLElement,
    c: HTMLElement,
    cDamage: HTMLElement,
    d: HTMLElement,
    dDamage: HTMLElement,
    hero: HTMLElement,
    heroDamage: HTMLElement,
    graveyard: HTMLElement
  },
  opponent: {
    a: HTMLElement,
    aDamage: HTMLElement,
    b: HTMLElement,
    bDamage: HTMLElement,
    c: HTMLElement,
    cDamage: HTMLElement,
    d: HTMLElement,
    dDamage: HTMLElement,
    hero: HTMLElement,
    heroDamage: HTMLElement,
    graveyard: HTMLElement
  },
  magic: {
    trigger: boolean;
    card: GameTrapCard;
    name: string;
  },
  trap: {
    trigger: boolean;
    card: GameTrapCard;
    name: string;
  },
  trapset: {
    trigger: boolean;
    name: string;
  },
}

const nodeStore = writable<NodeStore>({
  player: {
    a: undefined,
    aDamage: undefined,
    b: undefined,
    bDamage: undefined,
    c: undefined,
    cDamage: undefined,
    d: undefined,
    dDamage: undefined,
    graveyard: undefined,
    hero: undefined,
    heroDamage: undefined
  },
  opponent: {
    a: undefined,
    aDamage: undefined,
    b: undefined,
    bDamage: undefined,
    c: undefined,
    cDamage: undefined,
    d: undefined,
    dDamage: undefined,
    graveyard: undefined,
    hero: undefined,
    heroDamage: undefined
  },
  magic: {
    trigger: false,
    card: {} as GameTrapCard,
    name: ""
  },
  trap: {
    trigger: false,
    card: {} as GameTrapCard,
    name: ""
  },
  trapset: {
    trigger: false,
    name: ""
  },
});

export {nodeStore};
