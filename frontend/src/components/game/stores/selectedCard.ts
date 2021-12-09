import {writable} from "svelte/store";
import type {Writable} from "svelte/store";

interface SelectedCard {
  gid: number;
  id: number;
}

const selectedCard: Writable<SelectedCard> = writable({
  gid: 0,
  id: 0
});

export default selectedCard;