import {buildDeck} from "./buildDeck";
import type {Player} from "@som/shared/types/mongo";
import type {Game, GameCards} from "models/game";
import {heroes} from "@som/shared/data";

const generateGame = (type: "casual" | "ranked" | "custom", gameId: number, playerA: Player, playerB: Player): Game => {
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

  const playerAHero = heroes.find(({klass}) => klass === playerASelectedDeck.klass);
  const playerBHero = heroes.find(({klass}) => klass === playerBSelectedDeck.klass);

  if (!playerAHero || !playerBHero) { return {} as Game; }

  return {
    gameId,
    type,
    currentPlayer: playerA.username,
    currentTurn: 0,
    playerA: {
      username: playerA.username,
      hero: {...playerAHero, maxHealth: 100, maxMana: 20},
      minion: {a: undefined, b: undefined, c: undefined, d: undefined},
      trap: undefined,
      hand: playerAHand,
      deck: playerADeck,
      graveyard: []
    },
    playerB: {
      username: playerB.username,
      hero: {...playerBHero, maxHealth: 100, maxMana: 20},
      minion: {a: undefined, b: undefined, c: undefined, d: undefined},
      trap: undefined,
      hand: playerBHand,
      deck: playerBDeck,
      graveyard: []
    },
  };
};

export {generateGame};
