import {writable} from "svelte/store";
import {CardType} from "enums";
import type {Writable} from "svelte/store";

interface SelectedHandCard {
  gid: number;
  id: number;
  type: CardType;
}

const selectedHandCard: Writable<SelectedHandCard> = writable({
  gid: 0,
  id: 0,
  type: CardType.MINION
});

export default selectedHandCard;
