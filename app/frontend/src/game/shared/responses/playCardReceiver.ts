import {gameStore} from "game/stores";

import type {PlayCardReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const playCardReceiver: Res<PlayCardReceiverRes> = (params) => {
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
