import {endGame} from "./endGame";
import type {Game} from "@som/shared/types/mongo";

const isGameOver = async (game: Game): Promise<boolean> => {
  if (game.playerA.field.hero.health <= 0) {
    await endGame(game.id, game.playerB.name);
    return true;
  } else if (game.playerB.field.hero.health <= 0) {
    await endGame(game.id, game.playerA.name);
    return true;
  }

  return false;
};

export {isGameOver};
