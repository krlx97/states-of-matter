import { writable } from "svelte/store";

interface TooltipStore {
  battleLogBottom: number;
}

const tooltipStore = writable<TooltipStore>({
  battleLogBottom: 0
});

export {tooltipStore};
