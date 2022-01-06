import {gameStore} from "game/stores";
import type {PlayCardReceiver} from "./PlayCardReceiver.model";
import type {Res} from "models";

const playCardReceiver: Res<PlayCardReceiver> = (params) => {
  const {field, card} = params;

  gameStore.update((store) => {
    const {fields, hero} = store.opponent;

    hero.mana -= card.manaCost;
    fields[field] = card;
    store.opponent.hand -= 1;

    return store;
  });
};

export default playCardReceiver;
