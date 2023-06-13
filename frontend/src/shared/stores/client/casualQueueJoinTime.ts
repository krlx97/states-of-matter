import {writable} from "svelte/store";

const casualQueueJoinTime = writable<number>(0);

export {casualQueueJoinTime};
