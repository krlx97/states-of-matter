import {writable} from "svelte/store";

interface Modals {
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
  sendToken: boolean;
}

interface ModalStore {
  data: any;
  current: string;
  list: Modals;
}

export const modalStore = writable<ModalStore>({
  data: {},
  current: "",
  list: {
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
    sendToken: false
  }
});
