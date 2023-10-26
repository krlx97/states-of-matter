import type {Game} from "@som/shared/types/mongo";
import type {GameView} from "@som/shared/types/views";

type GenerateGameView = (game: Game, name: string) => GameView;

const generateGameView: GenerateGameView = ({
  id,
  type,
  currentPlayer,
  currentTurn,
  gameLogs,
  playerA,
  playerB
}, name) => ({
  id,
  type,
  currentPlayer,
  currentTurn,
  gameLogs,
  player: playerA.name === name ? {
    name: playerA.name,
    // hero: playerA.hero,
    // minion: playerA.minion,
    field: playerA.field,
    trap: playerA.trap,
    deck: playerA.deck.length,
    hand: playerA.hand,
    graveyard: playerA.graveyard,
    skins: playerA.skins
  } : {
    name: playerB.name,
    // hero: playerB.hero,
    // minion: playerB.minion,
    field: playerB.field,
    trap: playerB.trap,
    deck: playerB.deck.length,
    hand: playerB.hand,
    graveyard: playerB.graveyard,
    skins: playerB.skins
  },
  opponent: playerA.name === name ? {
    name: playerB.name,
    // hero: playerB.hero,
    // minion: playerB.minion,
    field: playerB.field,
    trap: playerB.trap ? true : false,
    deck: playerB.deck.length,
    hand: playerB.hand.length,
    graveyard: playerB.graveyard,
    skins: playerB.skins
  } : {
    name: playerA.name,
    // hero: playerA.hero,
    // minion: playerA.minion,
    field: playerA.field,
    trap: playerA.trap ? true : false,
    deck: playerA.deck.length,
    hand: playerA.hand.length,
    graveyard: playerA.graveyard,
    skins: playerA.skins
  }
});

export {generateGameView};
