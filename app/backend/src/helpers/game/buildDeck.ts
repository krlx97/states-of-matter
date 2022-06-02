import {cards} from "@som/shared/data";
import {randomInt} from "crypto";
import type {Player} from "@som/shared/types/mongo";
import type {GameCards, GameMagic, GameMinion, GameTrap} from "models/game";

const buildDeck = (player: Player): GameCards => {
  let deck: GameCards = [];
  let gid = 1;

  player.decks[player.deckId].cards.forEach((deckCard) => {
    const card = cards.find((card) => card.id === deckCard.id);

    if (!card) { return; }

    const {id, klass, name, type, manaCost, effects, damage, health} = card;
    let builtCard: GameMinion | GameMagic | GameTrap;

    if (health && damage) {
      builtCard = {
        gid,
        id,
        klass,
        name,
        type,
        manaCost,
        effects,
        damage,
        health,
        maxHealth: health,
        canAttack: false,
        hasTriggeredEffect: false
      };
    } else {
      builtCard = {gid, id, klass, name, type, manaCost, effects};
    }

    deck.push(builtCard);
    deckCard.amount > 1 && deck.push(builtCard);

    gid += 1;
  });

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i + 1);
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
};

export {buildDeck};
