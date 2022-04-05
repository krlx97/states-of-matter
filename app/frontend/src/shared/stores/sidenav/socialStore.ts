import {writable, type Writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {Social} from "../../models/view/Social";

export const socialStore: Writable<Social> = writable({
  friends: [],
  chat: {
    username: "",
    avatarId: 0,
    status: PlayerStatus.OFFLINE,
    isOpen: false,
    messages: []
  }
});
