import {writable} from "svelte/store";

interface GamePopupStore {
  playersAccepted: number;
}

const gamePopupStore = writable<GamePopupStore>({
  playersAccepted: 0
});

export {gamePopupStore};
