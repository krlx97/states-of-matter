import {writable} from "svelte/store";

import type {Writable} from "svelte/store";
import type {Deck} from "./decksStore.models";

const decksStore: Writable<Deck[]> = writable([]);

export default decksStore;
