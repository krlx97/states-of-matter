import {randomInt} from "crypto";
import {cards} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import type {
  GameCards,
  GameMagicCard,
  GameMinionCard,
  GameTrapCard
} from "@som/shared/types/backend/game";
import type {PlayerDeck} from "@som/shared/types/backend/player";

const buildDeck = (deck: PlayerDeck): GameCards => {
  let gameDeck: GameCards = [];
  let gid = 1;

  deck.cards.forEach((deckCard) => {
    const card = cards.find((card) => card.id === deckCard.id);

    if (!card) {
      console.error("One of the cards in the deck is invalid.");
      return;
    }

    if (card.type === CardType.HERO) {
      console.error("Hero cannot be a deck card.")
      return;
    }

    const {id, klass, effect, manaCost} = card;
    let gameCard: GameMagicCard | GameMinionCard | GameTrapCard;

    if (card.type === CardType.MINION) {
      const {type, health, damage} = card;

      gameCard = {
        id,
        gid,
        klass,
        effect,
        type,
        health,
        damage,
        manaCost,
        maxHealth: health,
        canAttack: false,
        buffs: [],
        debuffs: []
      };
    } else {
      const {type} = card;
      gameCard = {id, gid, klass, effect, type, manaCost};
    }

    gameDeck.push(gameCard);
    gid += 1;

    if (deckCard.amount > 1) {
      gameDeck.push({...gameCard, gid});
      gid += 1;
    }
  });

  for (let i = gameDeck.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i + 1);
    const temp = gameDeck[i];

    gameDeck[i] = gameDeck[j];
    gameDeck[j] = temp;
  }

  return gameDeck;
};

export {buildDeck};
