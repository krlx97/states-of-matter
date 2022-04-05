import {writable, type Writable} from "svelte/store";
import {CardType} from "@som/shared/enums";
import type {SelectedCard} from "../../models/view/selectedCard";

export const selectedCardStore: Writable<SelectedCard> = writable({
  field: "",
  hand: {
    gid: 0,
    type: CardType.MINION
  }
});
