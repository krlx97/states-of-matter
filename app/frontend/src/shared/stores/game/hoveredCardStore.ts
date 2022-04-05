import {writable, type Writable} from "svelte/store";

export const hoveredCardStore: Writable<{field: string}> = writable({
  field: "",
});
