import {writable, type Writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {Player} from "../../models/data";

export const playerStore: Writable<Player> = writable({
  socketId: "",
  username: "",
  publicKey: "",
  privateKey: "",
  privateKeyHash: "",
  status: PlayerStatus.OFFLINE,
  xp: 0,
  lv: 1,
  deckId: 0,
  avatarId: 0,
  lobbyId: 0,
  gameId: 0,
  decks: [],
  social: {
    friends: [],
    requests: [],
    blocked: []
  },
  wallet: [],
  last_nonce: 0
});
