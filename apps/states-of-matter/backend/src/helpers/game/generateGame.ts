import {cards} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import {buildDeck} from "./buildDeck";
import type {Player} from "models/Player";
import type {Game, GameHero, GameCards} from "models/game";

const generateGame = (type: "casual" | "ranked" | "custom", gameId: number, playerA: Player, playerB: Player, 
playerASkins: any, playerBSkins: any): Game => {
  const playerAHand: GameCards = [];
  const playerBHand: GameCards = [];
  let playerADeck = buildDeck(playerA);
  let playerBDeck = buildDeck(playerB);

  playerAHand.push(...playerADeck.slice(-5));
  playerBHand.push(...playerBDeck.slice(-5));

  playerADeck = playerADeck.slice(0, -5);
  playerBDeck = playerBDeck.slice(0, -5);

  const playerASelectedDeck = playerA.decks.find(({id}) => id === playerA.deckId);
  const playerBSelectedDeck = playerB.decks.find(({id}) => id === playerB.deckId);

  if (!playerASelectedDeck || !playerBSelectedDeck) { return {} as Game; }

  const playerAHero: GameHero = cards.find(({type, klass}) => klass === playerASelectedDeck.klass && type === CardType.HERO) as any;
  const playerBHero: GameHero = cards.find(({type, klass}) => klass === playerBSelectedDeck.klass && type === CardType.HERO) as any;

  if (!playerAHero || !playerBHero) {
    return {} as Game;
  }

  return {
    gameId,
    type,
    currentPlayer: playerA.name,
    currentTurn: 0,
    battleLogs: [],
    selectedSkins: {
      playerA: {
        name: playerA.name,
        list: playerASkins
      },
      playerB: {
        name: playerB.name,
        list: playerBSkins
      }
    },
    playerA: {
      name: playerA.name,
      hero: {
        ...playerAHero,
        maxHealth: 20,
        maxMana: 10,
      },
      minion: {
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined
      },
      trap: undefined,
      hand: playerAHand,
      deck: playerADeck,
      graveyard: [],
      selectedSkins: []
    },
    playerB: {
      name: playerB.name,
      hero: {...playerBHero, maxHealth: 100, maxMana: 20},
      minion: {
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined
      },
      trap: undefined,
      hand: playerBHand,
      deck: playerBDeck,
      graveyard: [],
      selectedSkins: []
    },
  };
};

export {generateGame};
