import {cards, cardsView} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import type {Player} from "@som/shared/types/backend";
import type {PlayerView} from "@som/shared/types/frontend";

const generatePlayerView = (player: Player): PlayerView => {
  const {
    name,
    experience,
    level,
    elo,
    joinedAt,
    status,
    queueId,
    deckId,
    lobbyId,
    gamePopupId,
    gameId,
    games,
    skins,
    tutorial
  } = player;

  const decks = player.decks.map((deck) => ({
    id: deck.id,
    klass: deck.klass,
    name: deck.name,
    cardsInDeck: deck.cards.reduce((acc, {amount}) => acc += amount, 0),
    cards: deck.cards.map((deckCard) => {
      const card = cards.find((card) => deckCard.id === card.id);

      if (!card || card.type === CardType.HERO) {
        console.log("Card not found, deck invalid, hero can't be in deck...?");
        // this should never happen though...
        return {id: 0, name: "", amount: 0, manaCost: 0};
      }

      const cardView = cardsView.get(card.id);

      if (!cardView) {
        return {id: 0, name: "", amount: 0, manaCost: 0};
      }

      const {id, amount} = deckCard;
      const {manaCost} = card;
      const {name} = cardView;

      return {id, name, amount, manaCost};
    })
  }));

  return {
    name,
    experience,
    level,
    elo,
    joinedAt,
    status,
    queueId,
    deckId,
    lobbyId,
    gameId,
    gamePopupId,
    games,
    decks,
    skins,
    tutorial
  };
};

export {generatePlayerView};
