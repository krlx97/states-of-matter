import {writable} from "svelte/store";

const snapshotsStore = writable<any>();

export {snapshotsStore};
