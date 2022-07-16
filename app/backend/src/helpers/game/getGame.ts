import {gamesDb, playersDb} from "apis/mongo";

const getGame = async (socketId: string) => {
  const $player = await playersDb.findOne({socketId});

  if (!$player) { return; }

  const {username, gameId} = $player;
  const $game = await gamesDb.findOne({gameId});

  if (!$game) { return; }

  const {playerA, playerB} = $game;
  const player = playerA.username === username ? playerA : playerB;
  const opponent = playerA.username === username ? playerB : playerA;

  return {$game, player, opponent};
};

export {getGame};
