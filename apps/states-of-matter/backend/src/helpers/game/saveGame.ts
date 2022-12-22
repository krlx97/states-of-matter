import {gamesDb, playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {generateGameFrontend} from "./generateGameFe";
import type {Game} from "models/game";

const saveGame = async (game: Game): Promise<void> => {
  const {gameId, playerA, playerB} = game;

  const [$updateGame, $playerA, $playerB] = await Promise.all([
    gamesDb.replaceOne({gameId}, game),
    playersDb.findOne({
      name: playerA.name
    }),
    playersDb.findOne({
      name: playerB.name
    })
  ]);

  if (!$updateGame.modifiedCount || !$playerA || !$playerB) { return; }

  ioServer.to($playerA.socketId).emit("reloadGameState", {
    game: generateGameFrontend(game, $playerA.name)
  });

  ioServer.to($playerB.socketId).emit("reloadGameState", {
    game: generateGameFrontend(game, $playerB.name)
  });
};

export {saveGame};
