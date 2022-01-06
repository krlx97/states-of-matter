import {writable} from "svelte/store";
import type {Writable} from "svelte/store";

interface SelectedFieldCard {
  field: string;
}

const selectedFieldCard: Writable<SelectedFieldCard> = writable({
  field: ""
});

export default selectedFieldCard;
