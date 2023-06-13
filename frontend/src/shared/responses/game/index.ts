import {attackMinionSave} from "./attackMinionSave";
import {endGame} from "./endGame";
import {floatingText} from "./floatingText";
import {levelUp} from "./levelUp";
import {reloadGameState} from "./reloadGameState";

const gameResponses = [
  attackMinionSave,
  endGame,
  floatingText,
  levelUp,
  reloadGameState
];

export {gameResponses};
