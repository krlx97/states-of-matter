import {PlayerStatus} from "@som/shared/enums";
import {randomInt} from "crypto";
import {ioServer} from "apis/server";
import {gamesDb, playersDb} from "apis/mongo";
import {generateGame} from "./generateGame";
import {generateGameFrontend} from "./generateGameFe";
import type {GameType} from "models/game";
import {findSOM} from "apis/eos";

const startGame = async (type: GameType, playerA: string, playerB: string, gameId2 = 0): Promise<void> => {
  const gameId = randomInt(0, 2_147_483_647);

  const [$playerA, $playerB, playerAChain, playerBChain] = await Promise.all([
    playersDb.findOneAndUpdate({
      name: playerA
    }, {
      $set: {
        status: PlayerStatus.INGAME,
        gameId: gameId2
      }
    }),
    playersDb.findOneAndUpdate({
      name: playerB
    }, {
      $set: {
        status: PlayerStatus.INGAME,
        gameId: gameId2
      }
    }),
    findSOM(playerA),
    findSOM(playerB)
  ]);

  if (!$playerA.value || !$playerB.value || !playerAChain || !playerBChain) { return; }

  const game = generateGame(type, gameId2, $playerA.value, $playerB.value, playerAChain.selectedSkins, playerBChain.selectedSkins);
  const isInserted = await gamesDb.insertOne(game);

  if (!isInserted.insertedId) { return; }

  ioServer.to($playerA.value.socketId).emit("startGame", {
    game: generateGameFrontend(game, $playerA.value.name)
  });

  ioServer.to($playerB.value.socketId).emit("startGame", {
    game: generateGameFrontend(game, $playerB.value.name)
  });
};

export {startGame};
