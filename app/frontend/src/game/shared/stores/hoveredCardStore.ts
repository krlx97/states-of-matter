import {writable} from "svelte/store";
import type {Writable} from "svelte/store";

const hoveredCardStore: Writable<{field: string}> = writable({
  field: "",
});

export default hoveredCardStore;
