import {writable} from "svelte/store";

interface Text {
  id: number;
  animationId: number;
  text: string;
  frame: number;
  bottom: number;
  left: number;
  opacity: number;
}

interface FloatingTextStore {
  player: {
    hero: Text[],
    a: Text[],
    b: Text[],
    c: Text[],
    d: Text[]
  },
  opponent: {
    hero: Text[],
    a: Text[],
    b: Text[],
    c: Text[],
    d: Text[]
  },
}

const floatingTextStore = writable<FloatingTextStore>({
  player: {
    hero: [],
    a: [],
    b: [],
    c: [],
    d: []
  },
  opponent: {
    hero: [],
    a: [],
    b: [],
    c: [],
    d: []
  },
});

export {floatingTextStore};
