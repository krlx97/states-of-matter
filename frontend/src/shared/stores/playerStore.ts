import {writable} from "svelte/store";
import {PlayerStatus, QueueId} from "@som/shared/enums";
import type {PlayerView} from "@som/shared/types/views";

const playerStore = writable<PlayerView>({
  address: "",
  nonce: 0,
  name: "",
  joinedAt: Date.now(),
  status: PlayerStatus.OFFLINE,
  experience: 0,
  level: 1,
  elo: 400,
  avatarId: 100,
  bannerId: 200,
  deckId: 0, // should be called deckIndex, because this is actually index.
  queueId: QueueId.NONE,
  lobbyId: 0,
  gameId: 0,
  gamePopupId: 0,
  games: {
    casual: {won: 0, lost: 0},
    ranked: {won: 0, lost: 0},
    custom: {won: 0, lost: 0},
  },
  friends: [],
  mutualFriends: [],
  tasks: {
    daily: false,
    weekly: 0,
    dailyAlternative: 0
  },
  rewards: {
    ecr: "0",
    ees: "0"
  },
  tutorial: {
    deckBuilder: false,
    game: false,
    play: false,
    inventory: false
  },
  decks: [],
  skins: []
});

export {playerStore};
