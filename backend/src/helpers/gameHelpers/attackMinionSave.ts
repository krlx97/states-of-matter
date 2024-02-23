import {mongo, server} from "app";
import {generateGameView} from "./generateGameView";
import type {Animations} from "@som/shared/types/game";
import type {Game} from "@som/shared/types/mongo";

const attackMinionSave = async ($game: Game, animations: Animations, isEndTurn = false): Promise<void> => {
  const {$players, $games} = mongo;
  const {io} = server;
  const {playerA, playerB} = $game;

  const [$playerA, $playerB] = await Promise.all([
    $players.findOne({
      name: playerA.name
    }),
    $players.findOne({
      name: playerB.name
    })
  ]);

  if (!$playerA || !$playerB) {
    return;
  }

  io.to($playerA.socketId).emit("attackMinionSave", {
    game: generateGameView($game, $playerA.name),
    animations,
    isEndTurn
  });

  io.to($playerB.socketId).emit("attackMinionSave", {
    game: generateGameView($game, $playerB.name),
    animations,
    isEndTurn
  });

  await $games.replaceOne({id: $game.id}, $game);
};

export {attackMinionSave};
