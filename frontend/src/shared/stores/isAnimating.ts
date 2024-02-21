import { writable } from "svelte/store";

const isAnimating = writable(false);
export {isAnimating};

