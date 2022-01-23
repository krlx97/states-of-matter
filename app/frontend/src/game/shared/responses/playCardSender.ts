import {gameStore} from "game/stores";

import type {PlayCardSenderRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const playCardSender: Res<PlayCardSenderRes> = (params) => {
  const {field, gid} = params;

  gameStore.update((store) => {
    const {hand, fields, hero} = store.player;
    const handCard = hand.find((card) => card.gid === gid);

    hero.mana -= handCard.manaCost;
    fields[field] = handCard;
    hand.splice(hand.indexOf(handCard), 1);

    return store;
  });
};

export default playCardSender;
