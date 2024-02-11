import {writable} from "svelte/store";

const leaderboardsStore = writable<any>({
  byLevel: [],
  byElo: []
});

export {leaderboardsStore};
