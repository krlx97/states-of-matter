import { Animations } from "@som/shared/types/game";
import {endGame} from "./endGame";
import type {Game} from "@som/shared/types/mongo";

const isGameOver = async (game: Game, animations: Animations): Promise<boolean> => {
  if (game.playerA.field.hero.health.current <= 0) {
    await endGame(game.id, game.playerB.name, animations);
    return true;
  } else if (game.playerB.field.hero.health.current <= 0) {
    await endGame(game.id, game.playerA.name, animations);
    return true;
  }

  return false;
};

export {isGameOver};
