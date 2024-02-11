import {writable} from "svelte/store";

const queueStore = writable<any>({
  joinedAt: 0,
  interval: 0,
  timeInQueue: "00:00",
});

export {queueStore};
