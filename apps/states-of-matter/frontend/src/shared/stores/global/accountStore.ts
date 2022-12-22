import {writable} from "svelte/store";
import {PlayerStatus} from "@som/shared/enums";
import type {AccountFrontend} from "@som/shared/types/frontend";

const accountStore = writable<AccountFrontend>({
  profile: {
    name: "",
    publicKey: "",
    privateKey: "",
    privateKeyHash: "",
    nonce: 0,
    joinedAt: 0,
    avatarId: 0,
    isActivated: false
  },
  social: {
    friends: [],
    requests: [],
    blocked: [],
    chat: {
      avatarId: 0,
      isOpen: false,
      messages: [],
      status: 0,
      username: "name!"
    }
  },
  wallet: {
    fungible: [],
    nonFungible: []
  },
});

export {accountStore};
