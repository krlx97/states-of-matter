import Craft from "../../client/Inventory/Items/modals/Craft.svelte";
import ChangeDeckName from "../../client/DeckBuilder/modals/ChangeDeckName.svelte";
import RandomSkin from "../../client/Inventory/Items/modals/RandomSkin.svelte";

import {modalStore} from "stores";

export interface DialogData {
  ChangeDeckName: undefined;
  Craft: {item: {id: bigint, name: string, type: number, rarity: number, owned: boolean, balance: bigint, shards: bigint}};
  RandomSkin: {ids: Array<bigint>};
}

const modals = {
  ChangeDeckName,
  Craft,
  RandomSkin
};

const open2 = function <Key extends keyof DialogData>(modal: Key, data: DialogData[Key]): void {
  modalStore.update((store) => {
    store.Component = modals[modal];
    store.data = data;
    store.isVisible = true;

    return store;
  });
};

const item1 = {id: 51n, name: "XD", type: 0, rarity: 1, owned: true, balance: 12n, shards: 1412n};
const item2 = {id: 51n, name: "XD", type: 0, rarity: "1", owned: true, balance: 12n, shards: 1412n};

// open2("Craft", {item: item1});
// open2("Craft", {item: item2});

const open = (component: any, data: any = {}): void => {
  modalStore.update((store) => {
    store.component = component;
    store.data = data;
    store.isVisible = true;

    return store;
  });
};

const close = (): void => {
  modalStore.update((store) => {
    store.isVisible = false;
    store.component = undefined;
    store.data = undefined;

    return store;
  });
};

const modalService = {open, open2, close};

export {modalService};
