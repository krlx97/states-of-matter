import {writable, type Writable} from "svelte/store";

const casualQueueJoinTime: Writable<number> = writable(0);

export {casualQueueJoinTime};
