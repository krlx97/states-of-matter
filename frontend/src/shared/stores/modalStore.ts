import {writable, type Invalidator, type Subscriber, type Unsubscriber} from "svelte/store";
import {modals} from "../../global/Modals";
import type {ComponentType} from "svelte";

export interface DialogData {
  AddFriend: undefined;
  Approval: {name: string, ticker: "ecr" | "enrg"};
  ChangeDeckName: undefined;
  Craft: {item: {id: bigint, name: string, type: number, rarity: number, owned: boolean, balance: bigint, shards: bigint}};
  EffectSelect: undefined;
  Energize: undefined;
  RandomSkin: {ids: Array<bigint>};
}

interface ModalStoreData {
  Component: ComponentType | undefined;
  data: DialogData[keyof DialogData] | undefined;
}

interface ModalStore {
  subscribe (
    this: void,
    run: Subscriber<ModalStoreData>,
    invalidate?: Invalidator<ModalStoreData> | undefined
  ): Unsubscriber;
  open <Component extends keyof DialogData>(
    component: Component,
    data: DialogData[Component]
  ): void;
  close (): void;
}

const createModalStore = (): ModalStore => {
  const {set, subscribe} = writable<ModalStoreData>({
    Component: undefined,
    data: undefined
  });

  return {
    subscribe,
    open (component, data): void {
      const Component = modals[component];
      set({Component, data});
    },
    close (): void {
      set({
        Component: undefined,
        data: undefined
      });
    }
  };
};

const modalStore = createModalStore();

export {modalStore};
