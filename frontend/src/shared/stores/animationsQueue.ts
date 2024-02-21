import { writable } from "svelte/store";

const animationsQueue = writable<any[]>([]);

export {animationsQueue};
