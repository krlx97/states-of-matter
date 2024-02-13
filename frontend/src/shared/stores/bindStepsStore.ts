import { writable } from "svelte/store";

const bindStepsStore = writable({
  one: false,
  two: false,
  three: true
});

export {bindStepsStore};
