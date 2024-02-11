import {mongo, server} from "app";
import {generateGameView} from "./generateGameView";
import type {Animations} from "@som/shared/types/game";
import type {Game} from "@som/shared/types/mongo";

const attackMinionSave = async ($game: Game, animations: Animations): Promise<void> => {
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
    animations
  });

  io.to($playerB.socketId).emit("attackMinionSave", {
    game: generateGameView($game, $playerB.name),
    animations
  });

  await $games.replaceOne({id: $game.id}, $game);
};

export {attackMinionSave};
