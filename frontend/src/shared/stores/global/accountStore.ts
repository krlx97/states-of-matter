import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {AccountView} from "@som/shared/types/views";

const accountStore = writable<AccountView>({
  name: "",
  publicKey: "",
  avatarId: 0,
  bannerId: 0,
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
