import {playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import type {Game} from "models/game";

const floatingText = async (
  game: Game,
  username: string,
  attacked: any,
  attacker: any,
  attackedDamage: number,
  attackerDamage: number
): Promise<void> => {
  const {playerA, playerB} = game;
  const [$playerA, $playerB] = await Promise.all([
    playersDb.findOne({
      name: playerA.name
    }),
    playersDb.findOne({
      name: playerB.name
    })
  ]);

  if (!$playerA || !$playerB) { return; }

  if ($playerA.name === username) {
    ioServer.to($playerA.socketId).emit("floatingText", {
      attacked,
      attacker,
      attackedDamage,
      attackerDamage
    } as any);

    ioServer.to($playerB.socketId).emit("floatingText", {
      attacked: attacker,
      attacker: attacked,
      attackedDamage: attackerDamage,
      attackerDamage: attackedDamage
    } as any);
  } else {
    ioServer.to($playerA.socketId).emit("floatingText", {
      attacked: attacker,
      attacker: attacked,
      attackedDamage: attackerDamage,
      attackerDamage: attackedDamage
    } as any);

    ioServer.to($playerB.socketId).emit("floatingText", {
      attacked,
      attacker,
      attackedDamage,
      attackerDamage
    } as any);
  }
};

export {floatingText};
