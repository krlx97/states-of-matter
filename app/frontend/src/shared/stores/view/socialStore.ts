import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {Writable} from "svelte/store";
import type {Social} from "models/view/Social";

const socialStore: Writable<Social> = writable({
  friends: [],
  chat: {
    username: "",
    avatarId: 0,
    status: PlayerStatus.OFFLINE,
    isOpen: false,
    messages: []
  }
});

export default socialStore;
