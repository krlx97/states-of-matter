import {writable} from "svelte/store";
import type {Field, GameCard} from "@som/shared/types/mongo";

interface SelectedCard {
  field: Field | undefined;
  hand: GameCard | undefined;
  graveyard: GameCard | undefined;
}

const selectedCardStore = writable<SelectedCard>({
  field: undefined,
  hand: undefined,
  graveyard: undefined
});

export {selectedCardStore};
