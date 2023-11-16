import {cards} from "@som/shared/data";
import {CardType, GameType} from "@som/shared/enums";
import {buildDeck} from "./buildDeck";

import type {
  Game,
  GameCards,
  GameHeroCard,
  Player
} from "@som/shared/types/mongo";

const generateGame = (
  id: number,
  type: GameType,
  playerA: Player,
  playerB: Player
): Game => {
  const playerASelectedDeck = playerA.decks.find(({id}) => id === playerA.deckId);
  const playerBSelectedDeck = playerB.decks.find(({id}) => id === playerB.deckId);

  if (!playerASelectedDeck || !playerBSelectedDeck) { return {} as Game; }

  const playerAHand: GameCards = [];
  const playerBHand: GameCards = [];
  let playerADeck = buildDeck(playerASelectedDeck);
  let playerBDeck = buildDeck(playerBSelectedDeck);

  if (playerADeck.length !== 30 || playerBDeck.length !== 30) { return {} as Game; }

  playerAHand.push(...playerADeck.slice(-5));
  playerADeck = playerADeck.slice(0, -5);
  playerBHand.push(...playerBDeck.slice(-5));
  playerBDeck = playerBDeck.slice(0, -5);

  const playerAHero = cards.find(({type, klass}) => klass === playerASelectedDeck.klass && type === CardType.HERO) as GameHeroCard;
  const playerBHero = cards.find(({type, klass}) => klass === playerBSelectedDeck.klass && type === CardType.HERO) as GameHeroCard;

  if (!playerAHero || !playerBHero) {
    return {} as Game;
  }

  return {
    id,
    type,
    currentPlayer: playerA.name,
    currentTurn: 0,
    gameLogs: [],
    playerA: {
      name: playerA.name,
      field: {
        hero: {
          ...playerAHero,
          maxHealth: 20,
          maxMana: 10,
          buffs: [],
          debuffs: []
        },
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined
      },
      trap: undefined,
      hand: playerAHand,
      deck: playerADeck,
      graveyard: [],
      skins: playerA.skins
    },
    playerB: {
      name: playerB.name,
      field: {
        hero: {
          ...playerBHero,
          maxHealth: 20,
          maxMana: 10,
          buffs: [],
          debuffs: []
        },
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined
      },
      trap: undefined,
      hand: playerBHand,
      deck: playerBDeck,
      graveyard: [],
      skins: playerB.skins
    },
  };
};

export {generateGame};
