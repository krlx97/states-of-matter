import {effect} from "./effect";
import {attackMinionSave} from "./attackMinionSave";
import {buildDeck} from "./buildDeck";
import {deductHealth} from "./deductHealth";
import {deductHeroHealth} from "./deductHeroHealth";
import {endGame} from "./endGame";
import {endTurnTimeouts} from "./endTurnTimeouts";
import {gamePopup} from "./gamePopup";
import {generateGame} from "./generateGame";
import {generateGameView} from "./generateGameView";
import {getAdjacentMinions} from "./getAdjacentMinions";
import {getGame} from "./getGame";
import {getRandomMinion} from "./getRandomMinion";
import {insertBuff} from "./insertBuff";
import {insertDebuff} from "./insertDebuff";
import {isGameOver} from "./isGameOver";
import {moveToGraveyard} from "./moveToGraveyard";
import {saveGame} from "./saveGame";
import {startGame} from "./startGame";
import {endTurn} from "./endTurn";

const gameHelpers = {
  effect,
endTurn,
  attackMinionSave,
  buildDeck,
  deductHealth,
deductHeroHealth,
  endGame,
  gamePopup,
  generateGame,
  generateGameView,
  getAdjacentMinions,
endTurnTimeouts,
  getGame,
  getRandomMinion,
  insertBuff,
  insertDebuff,
  isGameOver,
  moveToGraveyard,
  saveGame,
  startGame,
};

export {gameHelpers};
