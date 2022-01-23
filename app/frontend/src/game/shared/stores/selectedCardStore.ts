import {writable} from "svelte/store";
import {CardType} from "@som/shared/enums";
import type {Writable} from "svelte/store";
import type {SelectedCard} from "game/models/selectedCard";

const selectedCardStore: Writable<SelectedCard> = writable({
  field: "",
  hand: {
    gid: 0,
    type: CardType.MINION
  }
});

export default selectedCardStore;
