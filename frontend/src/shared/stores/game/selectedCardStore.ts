import {writable} from "svelte/store";

interface SelectedCard {
  field: "a" | "b" | "c" | "d" | undefined;
  hand: any | undefined;
  graveyard: any | undefined;
}

const selectedCardStore = writable<SelectedCard>({
  field: undefined,
  hand: undefined,
  graveyard: undefined
});

export {selectedCardStore};
