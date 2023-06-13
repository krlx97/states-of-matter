import {mongo, server} from "apis";
import {generateGameView} from "./generateGameFe";
import type {Game} from "@som/shared/types/backend";

const attackMinionSave = async (
  $game: Game,
  username: string,
  attacker: string,
  attacked: string,
  attackerDamage: number,
  attackedDamage: number
): Promise<void> => {
  const {players, games} = mongo;
  const {io} = server;
  const {playerA, playerB} = $game;
  const [$playerA, $playerB] = await Promise.all([
    players.findOne({
      name: playerA.name
    }),
    players.findOne({
      name: playerB.name
    })
  ]);

  if (!$playerA || !$playerB) {
    return;
  }

  io.to($playerA.socketId).emit("attackMinionSave" as any, {
    game: generateGameView($game, $playerA.name),
    username,
    attacker,
    attacked,
    attackedDamage,
    attackerDamage
  });

  io.to($playerB.socketId).emit("attackMinionSave" as any, {
    game: generateGameView($game, $playerB.name),
    username,
    attacker,
    attacked,
    attackedDamage,
    attackerDamage
  });

  // if ($playerA.name === username) {
  //   io.to($playerA.socketId).emit("attackMinionSave" as any, {
  //     game: generateGameView($game, $playerA.name),
  //     username,
  //     playerField: attacker,
  //     opponentField: attacked,
  //     playerDamageTaken: attackedDamage,
  //     opponentDamageTaken: attackerDamage
  //   });

  //   io.to($playerB.socketId).emit("attackMinionSave" as any, {
  //     game: generateGameView($game, $playerB.name),
  //     username,
  //     playerField: attacked,
  //     opponentField: attacker,
  //     playerDamageTaken: attackerDamage,
  //     opponentDamageTaken: attackedDamage
  //   });
  // }
  // else {
  //   io.to($playerA.socketId).emit("attackMinionSave" as any, {
  //     game: generateGameView($game, $playerA.name),
  //     username,
  //     playerField: attacked,
  //     opponentField: attacker,
  //     playerDamageTaken: attackerDamage,
  //     opponentDamageTaken: attackedDamage
  //   });

  //   io.to($playerB.socketId).emit("attackMinionSave" as any, {
  //     game: generateGameView($game, $playerB.name),
  //     username,
  //     playerField: attacker,
  //     opponentField: attacked,
  //     playerDamageTaken: attackedDamage,
  //     opponentDamageTaken: attackerDamage
  //   });
  // }

  await games.replaceOne({id: $game.id}, $game);
};

export {attackMinionSave};
