import type {GameView} from "@som/shared/types/frontend";
import type {Game} from "@som/shared/types/backend";

const generateGameView = (game: Game, name: string): GameView => {
  const {
    id,
    type,
    currentPlayer,
    currentTurn,
    gameLogs,
    playerA,
    playerB
  } = game;

  return {
    id,
    type,
    currentPlayer,
    currentTurn,
    gameLogs,
    player: playerA.name === name ? {
      name: playerA.name,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap,
      deck: playerA.deck.length,
      hand: playerA.hand,
      graveyard: playerA.graveyard,
      skins: playerA.skins
    } : {
      name: playerB.name,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap,
      deck: playerB.deck.length,
      hand: playerB.hand,
      graveyard: playerB.graveyard,
      skins: playerB.skins
    },
    opponent: playerA.name === name ? {
      name: playerB.name,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap ? true : false,
      deck: playerB.deck.length,
      hand: playerB.hand.length,
      graveyard: playerB.graveyard,
      skins: playerB.skins
    } : {
      name: playerA.name,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap ? true : false,
      deck: playerA.deck.length,
      hand: playerA.hand.length,
      graveyard: playerA.graveyard,
      skins: playerA.skins
    }
  };
};

export {generateGameView};
