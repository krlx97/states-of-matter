import {writable} from "svelte/store";

export const hoveredCardStore = writable<{field: "" | "a" | "b" | "c" | "d"}>({
  field: ""
});
