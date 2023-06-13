import {animateMagicTrigger} from "./animateMagicTrigger";
import {animateTrapTrigger} from "./animateTrapTrigger";
import {attackMinionSave} from "./attackMinionSave";
import {buildDeck} from "./buildDeck";
import {deductHealth} from "./deductHealth";
import {drawCard} from "./drawCard";
import {endGame} from "./endGame";
import {generateGame} from "./generateGame";
import {generateGameView} from "./generateGameFe";
import {getGame} from "./getGame";
import {getRandomMinion} from "./getRandomMinion";
import {isGameOver} from "./isGameOver";
import {moveToGraveyard} from "./moveToGraveyard";
import {gamePopup} from "./gamePopup";
import {saveGame} from "./saveGame";
import {startGame} from "./startGame";
import {triggerEffect} from "./triggerEffect";
import { insertBuff } from "./insertBuff";
import { insertDebuff } from "./insertDebuff";
import { getAdjacentMinions } from "./getAdjacentMinions";

const gameEngine = {
  animateMagicTrigger,
  animateTrapTrigger,
  attackMinionSave,
  buildDeck,
  deductHealth,
  drawCard,
  endGame,
  generateGame,
  generateGameView,
  getAdjacentMinions,
  getGame,
  getRandomMinion,
  isGameOver,
  moveToGraveyard,
  gamePopup,
  saveGame,
  startGame,
  insertBuff,
  insertDebuff,
  triggerEffect
};

export default gameEngine;
