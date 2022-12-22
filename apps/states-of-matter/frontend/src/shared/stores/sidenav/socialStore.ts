import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {Social} from "../../models/view/Social";

const socialStore = writable<Social>({
  friends: [],
  chat: {
    username: "",
    avatarId: 0,
    status: PlayerStatus.OFFLINE,
    isOpen: false,
    messages: []
  }
});

export {socialStore};
