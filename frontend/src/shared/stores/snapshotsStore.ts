import {writable} from "svelte/store";

const snapshotsStore = writable<Array<{
  name: "ecr" | "enrg";
  snapshots: Array<{
    date: number;
    supply: string;
  }>;
}>>([]);

export {snapshotsStore};
