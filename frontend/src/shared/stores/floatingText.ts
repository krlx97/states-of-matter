import {writable} from "svelte/store";

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
