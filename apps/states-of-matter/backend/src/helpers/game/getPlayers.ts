import type {Game} from "models/game";

const getPlayers = (game: Game, name: string) => {
  const {playerA, playerB} = game;
  const player = playerA.name === name ? playerA : playerB;
  const opponent = playerA.name === name ? playerB : playerA;

  return {player, opponent};
};

export {getPlayers};
