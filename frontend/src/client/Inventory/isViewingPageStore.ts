import { writable } from "svelte/store";

export const isViewingPageStore = writable(false);
export const selectedToken = writable<any>();
