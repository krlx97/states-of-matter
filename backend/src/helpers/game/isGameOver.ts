import {endGame} from "./endGame";
import type {Game} from "@som/shared/types/backend";

const isGameOver = async (game: Game): Promise<boolean> => {
  if (game.playerA.hero.health <= 0) {
    await endGame(game.id, game.playerB.name);
    return true;
  } else if (game.playerB.hero.health <= 0) {
    await endGame(game.id, game.playerA.name);
    return true;
  }

  return false;
};

export {isGameOver};
