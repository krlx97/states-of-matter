import {get} from "svelte/store";
import {cards} from "@som/shared/data";
import {playerStore} from "stores/data";
import {decksStore} from "client/stores";

import type {SelectDeckRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const selectDeck: Res<SelectDeckRes> = (params) => {
  const {deckId} = params;
  const player = get(playerStore);

  playerStore.update((player) => {
    player.deckId = deckId;
    return player;
  });

  decksStore.update((store) => {
    const {deckId} = player;
    const deck = player.decks.find((deck) => deck.id === deckId);

    store.deckCards = deck.cards.map((deckCard) => {
      const card = cards.find((card) => card.id === deckCard.id);
      const {id, klass, name} = card;
      const {amount} = deckCard;

      return {klass, id, name, amount};
    });

    return store;
  });
};

export default selectDeck;
