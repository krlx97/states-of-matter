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
    hero: string,
    a: string,
    b: string,
    c: string,
    d: string
  },
  opponent: {
    hero: string,
    a: string,
    b: string,
    c: string,
    d: string
  },
}

const floatingTextStore = writable<FloatingTextStore>({
  player: {
    hero: "",
    a: "",
    b: "",
    c: "",
    d: ""
  },
  opponent: {
    hero: "",
    a: "",
    b: "",
    c: "",
    d: ""
  },
});

export {floatingTextStore};
