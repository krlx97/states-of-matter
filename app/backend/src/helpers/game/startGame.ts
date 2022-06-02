import {PlayerStatus} from "@som/shared/enums";
import {randomInt} from "crypto";
import {ioServer} from "apis/server";
import {gamesDb, playersDb} from "apis/mongo";
import {generateGame} from "./generateGame";
import {generateGameFrontend} from "./generateGameFe";

const startGame = async (type: "casual" | "ranked" | "custom", playerA: string, playerB: string): Promise<void> => {
  const gameId = randomInt(0, 1000000);

  const [upd1, upd2] = await Promise.all([
    playersDb.findOneAndUpdate({
      username: playerA
    }, {
      $set: {
        status: PlayerStatus.INGAME,
        gameId
      }
    }),
    playersDb.findOneAndUpdate({
      username: playerB
    }, {
      $set: {
        status: PlayerStatus.INGAME,
        gameId
      }
    })
  ]);

  if (!upd1.value || !upd2.value) { return; }

  const game = generateGame(type, gameId, upd1.value, upd2.value);
  const isInserted = await gamesDb.insertOne(game);

  if (!isInserted.insertedId) { return; }

  ioServer.to(upd1.value.socketId).emit("startGame", {
    game: generateGameFrontend(game, upd1.value.username)
  });

  ioServer.to(upd2.value.socketId).emit("startGame", {
    game: generateGameFrontend(game, upd2.value.username)
  });
};

export {startGame};
