import {writable} from "svelte/store";

interface Modals {
  gamePopup: boolean;
  addFriend: boolean;
  block: boolean;
  cardLore: boolean;
  changeDeckName: boolean;
  gift: boolean;
  joinLobby: boolean;
  setDeckKlass: boolean;
  tip: boolean;
  unfriend: boolean;
  graveyard: boolean;
  stake: boolean;
  swap: boolean;
  transfer: boolean;
  sendToken: boolean;
  unstake: boolean;
  claim: boolean;
  nftInfo: boolean;
}

interface ModalStore {
  data: any;
  current: string;
  list: Modals;
}

const modalStore = writable<ModalStore>({
  data: {},
  current: "",
  list: {
    gamePopup: false,
    addFriend: false,
    block: false,
    cardLore: false,
    changeDeckName: false,
    gift: false,
    joinLobby: false,
    setDeckKlass: false,
    tip: false,
    unfriend: false,
    graveyard: false,
    stake: false,
    swap: false,
    transfer: false,
    sendToken: false,
    unstake: false,
    claim: false,
    nftInfo: false,
  }
});

export {modalStore};
