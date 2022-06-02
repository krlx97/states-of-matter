import {gamesDb, playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {generateGameFrontend} from "./generateGameFe";
import type {Game} from "models/game";

const saveGame = async (game: Game): Promise<void> => {
  const {gameId, playerA, playerB} = game;
  const [$updateGame, $playerA, $playerB] = await Promise.all([
    gamesDb.replaceOne({gameId}, game),
    playersDb.findOne({
      username: playerA.username
    }),
    playersDb.findOne({
      username: playerB.username
    })
  ]);

  if (!$updateGame.modifiedCount || !$playerA || !$playerB) { return; }

  ioServer.to($playerA.socketId).emit("reloadGameState", {
    game: generateGameFrontend(game, playerA.username)
  });

  ioServer.to($playerB.socketId).emit("reloadGameState", {
    game: generateGameFrontend(game, playerB.username)
  });
};

export {saveGame};
