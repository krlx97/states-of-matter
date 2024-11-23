import {writable} from "svelte/store";

export const canSave = writable(false);

export const isDeckSame = (a: any, b: any, onlyReturn = false): boolean => {
  const aStr = JSON.stringify(a.cards.map(({id, amount}) => ({id, amount})));
  const bStr = JSON.stringify(b.cards.map(({id, amount}) => ({id, amount})));

  if (aStr !== bStr || a.klass !== b.klass || a.name !== b.name) {
    if (onlyReturn) {
      return true;
    } else {
      canSave.set(true);
    }
  } else {
    if (onlyReturn) {
      return false;
    } else {
      canSave.set(false);
    }
  }
};
