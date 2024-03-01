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
  line: HTMLDivElement,
  showLine: boolean,
  lineCss: string;
  lineX: number;
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
  barInterval: NodeJS.Timeout;
  barHeight: string;
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
  line: undefined,
  showLine: false,
  lineCss: "",
  lineX: 0,
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
  turn: {
    trigger: false,
    name: ""
  },
  barInterval: undefined,
  barHeight: "0%"
});

export {nodeStore};
