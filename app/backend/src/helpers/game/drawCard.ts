import {endGame} from "./endGame";
import type {Game, GamePlayer} from "models/game";

const drawCard = async (game: Game, player: GamePlayer): Promise<void> => {
  const {hand, deck} = player;
  const card = deck.pop();

  if (!card) { return await endGame(game, "A"); }

  hand.push(card);
};

export {drawCard};
