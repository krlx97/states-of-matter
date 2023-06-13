import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {AccountFrontend} from "@som/shared/types/frontend";

const accountStore = writable<AccountFrontend>({
  name: "",
  publicKey: "",
  avatarId: 0,
  social: {
    friends: [],
    requests: [],
    blocked: [],
    chat: {
      name: "",
      status: PlayerStatus.OFFLINE,
      avatarId: 0,
      messages: [],
      isOpen: false
    }
  }
});

export {accountStore};
