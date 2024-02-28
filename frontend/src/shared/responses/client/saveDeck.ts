import {socketService} from "services";
import { isDeckSame } from "../../../client/DeckBuilder/canSave";
import {deckCache, playerStore} from "stores";
import { get } from "svelte/store";
import { cards, cardsView } from "@som/shared/data";
import { CardKlass, CardType } from "@som/shared/enums";

const saveDeck = (): void => {
  socketService.socket.on("saveDeck", (params): void => {
    const {deck} = params;

    deckCache.update((store) => {
      store.name = deck.name;
      store.klass = deck.klass;
      store.cardsInDeck = deck.cards.reduce((acc, {amount}) => acc += amount, 0);
      store.average = {
        health: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (
            !card ||
            card.type === CardType.HERO ||
            card.type === CardType.MAGIC ||
            card.type === CardType.TRAP
          ) {
            return acc;
          }

          return acc += card.health * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0,
        damage: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (
            !card ||
            card.type === CardType.HERO ||
            card.type === CardType.MAGIC ||
            card.type === CardType.TRAP
          ) {
            return acc;
          }

          return acc += card.damage * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if ( !card || card.type !== CardType.MINION) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0) || 0,
        manaCost: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type === CardType.HERO) {
            return acc;
          }

          return acc += card.manaCost * deckCard.amount;
        }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0
      };
      store.attribute = {
        minion: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.MINION) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        magic: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.MAGIC) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        trap: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.type !== CardType.TRAP) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        neutral: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.NEUTRAL) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        solid: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.SOLID) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        liquid: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.LIQUID) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        gas: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.GAS) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
        plasma: deck.cards.reduce((acc, deckCard) => {
          const card = cards.find((card): boolean => deckCard.id === card.id);

          if (!card || card.klass !== CardKlass.PLASMA) {
            return acc;
          }

          return acc += deckCard.amount;
        }, 0),
      };
      store.cards = deck.cards.map((deckCard) => {
        const {id, amount} = deckCard;
        const card = cards.find((card): boolean => card.id === id);
        const cardView = cardsView.find((card): boolean => card.id === id);

        if (!card || !cardView || card.type === CardType.HERO) {
          return {id, name: "", type: 1, damage: 0, health: 0, manaCost: 0, amount: 1};
        }

        const {klass, type, manaCost} = card;
        const {name} = cardView;

        if (card.type === CardType.MINION) {
          const {health, damage} = card;
          return {id, name, klass, type, health, damage, manaCost, amount};
        } else {
          return {id, name, klass, type, manaCost, amount};
        }
      });

      return store;
    });

    const $playerStore = get(playerStore);

    isDeckSame(get(deckCache), $playerStore.decks[$playerStore.deckId]);
  });
};

export {saveDeck};
