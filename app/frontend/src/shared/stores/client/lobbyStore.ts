import {writable, type Writable} from "svelte/store";
import type {Lobby} from "@som/shared/interfaces/mongo";

export const lobbyStore: Writable<Lobby> = writable({
  lobbyId: 0,
  host: {
    username: "",
    socketId: "",
    avatarId: 0
  },
  challengee: {
    username: "",
    socketId: "",
    avatarId: 0
  }
});
