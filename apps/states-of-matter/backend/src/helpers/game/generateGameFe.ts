import type {GameFrontend} from "@som/shared/types/frontend";
import type {Game} from "models/game";

const generateGameFrontend = (game: Game, name: string): GameFrontend => {
  const {gameId, currentPlayer, currentTurn, battleLogs, selectedSkins, playerA, playerB} = game;

  return {
    gameId,
    currentPlayer,
    currentTurn,
    battleLogs,
    selectedSkins: {
      player: selectedSkins.playerA.name === name ? selectedSkins.playerA.list : selectedSkins.playerB.list,
      opponent: selectedSkins.playerA.name === name ? selectedSkins.playerB.list : selectedSkins.playerA.list
    },
    player: playerA.name === name ? {
      name: playerA.name,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap,
      deck: playerA.deck,
      hand: playerA.hand,
      graveyard: playerA.graveyard
    } : {
      name: playerB.name,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap,
      deck: playerB.deck,
      hand: playerB.hand,
      graveyard: playerB.graveyard
    },
    opponent: playerA.name === name ? {
      name: playerB.name,
      hero: playerB.hero,
      minion: playerB.minion,
      trap: playerB.trap ? true : false,
      deck: playerB.deck.length,
      hand: playerB.hand.length,
      graveyard: playerB.graveyard
    } : {
      name: playerA.name,
      hero: playerA.hero,
      minion: playerA.minion,
      trap: playerA.trap ? true : false,
      deck: playerA.deck.length,
      hand: playerA.hand.length,
      graveyard: playerA.graveyard
    }
  };
};

export {generateGameFrontend};
