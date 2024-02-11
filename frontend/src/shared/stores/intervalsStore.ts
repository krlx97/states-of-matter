import {writable} from "svelte/store";

const intervalsStore = writable<any>({
  queueTimer: 0
});

export {intervalsStore};
