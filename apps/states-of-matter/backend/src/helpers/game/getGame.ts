import {gamesDb, playersDb} from "apis/mongo";

const getGame = async (socketId: string) => {
  const $player = await playersDb.findOne({socketId});

  if (!$player) { return; }

  const {name, gameId} = $player;
  const $game = await gamesDb.findOne({gameId});

  if (!$game) { return; }

  const {playerA, playerB} = $game;
  const player = playerA.name === name ? playerA : playerB;
  const opponent = playerA.name === name ? playerB : playerA;

  return {$game, player, opponent};
};

export {getGame};
