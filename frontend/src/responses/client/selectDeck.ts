// import {get} from "svelte/store";
import { cards } from "data";
import {miscService} from "services";
import {playerStore} from "stores/data";
import { decksStore } from "stores/view";
import { get } from "svelte/store";
// import {deckStore} from "stores/view";

interface Params { deckId: number; }

const selectDeck = (params: Params): void => {
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

  // decksStore.deckCards = deck.cards.map((deckCard) => {
  //   const card = cards.find((card) => card.id === deckCard.id);
  //   const {id, klass, name} = card;
  //   const {amount} = deckCard;

  //   return {klass, id, name, amount};
  // });

  // deckStore.update((deck) => {
  //   const {name} = player.decks.find((deck) => deck.id === deck_id);
  //   deck.name = name;
  //   return deck;
  // });

  // miscService.showNotification("Deck changed successfully.");
};

export default selectDeck;
