import type {Game} from "models/game";

const getPlayers = (game: Game, username: string) => {
  const {playerA, playerB} = game;
  const player = playerA.username === username ? playerA : playerB;
  const opponent = playerA.username === username ? playerB : playerA;

  return {player, opponent};
};

export {getPlayers};
