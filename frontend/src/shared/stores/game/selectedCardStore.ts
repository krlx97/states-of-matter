import {writable} from "svelte/store";
import type {Card, Field} from "@som/shared/types/frontend";

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
