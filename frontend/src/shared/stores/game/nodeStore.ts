import {writable} from "svelte/store";

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
    graveyard: HTMLElement
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
    graveyard: undefined
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
    graveyard: undefined
  },
});

export {nodeStore};
