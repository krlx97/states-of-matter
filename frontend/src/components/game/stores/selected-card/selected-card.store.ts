import {writable} from "svelte/store";
import {CardType} from "enums";
import type {Writable} from "svelte/store";
import type {SelectedCard} from "./selected-card.model";

const selectedCardStore: Writable<SelectedCard> = writable({
  field: "",
  hand: {
    gid: 0,
    type: CardType.MINION
  }
});

export default selectedCardStore;
