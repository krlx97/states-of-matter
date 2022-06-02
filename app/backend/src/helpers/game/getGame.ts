import {gamesDb, playersDb} from "apis/mongo";

const getGame = async (socketId: string) => {
  const player = await playersDb.findOne({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gamesDb.findOne({gameId});

  if (!game) { return; }

  return {player, game};
};

export {getGame};
