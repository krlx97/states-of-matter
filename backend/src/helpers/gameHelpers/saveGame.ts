import {mongo, server} from "app";
import {generateGameView} from "./generateGameView";
import type {Game} from "@som/shared/types/mongo";

const saveGame = async (game: Game): Promise<void> => {
  const {$games, $players} = mongo;
  const {io} = server;
  const {id, playerA, playerB} = game;

  const [$updateGame, $playerA, $playerB] = await Promise.all([
    $games.replaceOne({id}, game),
    $players.findOne({
      name: playerA.name
    }),
    $players.findOne({
      name: playerB.name
    })
  ]);

  if (!$updateGame.modifiedCount || !$playerA || !$playerB) { return; }

  io.to($playerA.socketId).emit("reloadGameState", {
    game: generateGameView(game, $playerA.name)
  });

  io.to($playerB.socketId).emit("reloadGameState", {
    game: generateGameView(game, $playerB.name)
  });
};

export {saveGame};
