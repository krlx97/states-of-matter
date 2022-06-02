import {writable} from "svelte/store";

export const hoveredHandCardStore = writable<{i: number}>({
  i: -1
});
