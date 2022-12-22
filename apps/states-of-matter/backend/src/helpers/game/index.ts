import {battleLog} from "./battleLog";
import {buildDeck} from "./buildDeck";
import {drawCard} from "./drawCard";
import {endGame} from "./endGame";
import {floatingText} from "./floatingText";
import {generateGame} from "./generateGame";
import {generateGameFrontend} from "./generateGameFe";
import {getGame} from "./getGame";
import {getPlayers} from "./getPlayers";
import {isGameOver} from "./isGameOver";
import {playMinion} from "./playMinion";
import {gamePopup} from "./gamePopup";
import {saveGame} from "./saveGame";
import {startGame} from "./startGame";
import triggerEffect from "./triggerEffect";

const gameEngine = {
  battleLog,
  buildDeck,
  drawCard,
  endGame,
  floatingText,
  generateGame,
  generateGameFrontend,
  getGame,
  getPlayers,
  isGameOver,
  playMinion,
  gamePopup,
  saveGame,
  startGame,
  triggerEffect
};

export default gameEngine;
