import {writable} from "svelte/store";

const nodeStore = writable({
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
