import {endGame} from "./endGame";
import type {Game, GamePlayer} from "@som/shared/types/mongo";

const drawCard = async (
  game: Game,
  player: GamePlayer,
  opponent: GamePlayer
): Promise<void> => {
  const card = opponent.deck.pop();

  if (!card) {
    return await endGame(game.id, player.name);
  }

  opponent.hand.push(card);
};

export {drawCard};
