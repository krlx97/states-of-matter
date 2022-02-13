import {writable} from "svelte/store";
import type {Writable} from "svelte/store";

interface Modals {
  addFriend: boolean;
  block: boolean
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

const modalStore: Writable<ModalStore> = writable({
  data: {},
  current: "",
  list: {
    addFriend: false,
    block: false,
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

export default modalStore;
