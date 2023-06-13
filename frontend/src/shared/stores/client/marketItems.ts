import {writable} from "svelte/store";

const marketItemsStore = writable<any[]>([]);

export {marketItemsStore};
