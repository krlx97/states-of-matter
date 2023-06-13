import {mongo, server} from "apis";
import type {Game, GameTrapCard} from "@som/shared/types/backend/game";

const animateTrapTrigger = async (game: Game, username: string, card: GameTrapCard): Promise<void> => {
  const {players} = mongo;
  const {io} = server;
  const {playerA, playerB} = game;
  const [$playerA, $playerB] = await Promise.all([
    players.findOne({
      name: playerA.name
    }),
    players.findOne({
      name: playerB.name
    })
  ]);

  if (!$playerA || !$playerB) {
    console.error("Animate trap trigger failed fetching players.");
    return;
  }

  if ($playerA.name === username) {
    io.to($playerA.socketId).emit("animateTrapTrigger" as any, {
      username, card
    });

    io.to($playerB.socketId).emit("animateTrapTrigger" as any, {
      username, card
    });
  } else {
    io.to($playerA.socketId).emit("animateTrapTrigger" as any, {
      username, card
    });

    io.to($playerB.socketId).emit("animateTrapTrigger" as any, {
      username, card
    });
  }
};

export {animateTrapTrigger};
