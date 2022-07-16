import {buildDeck} from "./buildDeck";
import {drawCard} from "./drawCard";
import {endGame} from "./endGame";
import {generateGame} from "./generateGame";
import {generateGameFrontend} from "./generateGameFe";
import {getGame} from "./getGame";
import {getPlayers} from "./getPlayers";
import {isGameOver} from "./isGameOver";
import {playMinion} from "./playMinion";
import {saveGame} from "./saveGame";
import {startGame} from "./startGame";
import triggerEffect from "./triggerEffect";

const gameEngine = {
  buildDeck,
  drawCard,
  endGame,
  generateGame,
  generateGameFrontend,
  getGame,
  getPlayers,
  isGameOver,
  playMinion,
  saveGame,
  startGame,
  triggerEffect
};

export default gameEngine;
