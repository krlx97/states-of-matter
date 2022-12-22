import {endGame} from "./endGame";
import type {Game} from "models/game";

const isGameOver = async (game: Game): Promise<boolean> => {
  if (game.playerA.hero.health <= 0) {
    await endGame(game, "B");
    return true;
  } else if (game.playerB.hero.health <= 0) {
    await endGame(game, "A");
    return true;
  }

  return false;
};

export {isGameOver};
