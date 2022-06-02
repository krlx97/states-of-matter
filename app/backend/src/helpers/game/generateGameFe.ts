import type {GameFE} from "@som/shared/types/client";
import type {Game} from "models/game";

const generateGameFrontend = (game: Game, username: string): GameFE => {
  const {gameId, currentPlayer, currentTurn, playerA, playerB} = game;

  return {
    gameId,
    currentPlayer,
    currentTurn,
    player: playerA.username === username ? {
      username: playerA.username,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap,
      deck: playerA.deck,
      hand: playerA.hand,
      graveyard: playerA.graveyard
    } : {
      username: playerB.username,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap,
      deck: playerB.deck,
      hand: playerB.hand,
      graveyard: playerB.graveyard
    },
    opponent: playerA.username === username ? {
      username: playerB.username,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap,
      deck: playerB.deck.length,
      hand: playerB.hand.length,
      graveyard: playerB.graveyard
    } : {
      username: playerA.username,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap,
      deck: playerA.deck.length,
      hand: playerA.hand.length,
      graveyard: playerA.graveyard
    }
  };
};

export {generateGameFrontend};
