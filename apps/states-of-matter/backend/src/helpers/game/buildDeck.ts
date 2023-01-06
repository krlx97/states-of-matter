import {randomInt} from "crypto";
import {cards} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import type {Player} from "models/Player";
import type {GameCards, GameMagic, GameMinion, GameTrap} from "models/game";

const buildDeck = (player: Player): GameCards => {
  let deck: GameCards = [];
  let gid = 1;

  player.decks[player.deckId].cards.forEach((deckCard) => {
    const card = cards.find((card) => card.id === deckCard.id);

    if (!card || card.type === CardType.HERO) { return; }

    const {id, klass, name, type, manaCost, effect} = card;
    let builtCard: GameMinion | GameMagic | GameTrap;

    if (card.type === CardType.MINION) {
      const {damage, health} = card;

      builtCard = {
        gid,
        id,
        klass,
        name,
        type,
        manaCost,
        effect,
        damage,
        health,
        maxHealth: health,
        canAttack: false,
        hasTriggeredEffect: false,
        buffs: [],
        debuffs: []
      };
    } else {
      builtCard = {gid, id, klass, name, type, manaCost, effect,buffs: [],
        debuffs: []};
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
