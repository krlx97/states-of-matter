import {PlayerStatus} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {checkLevelUp} from "helpers/player";
import type {Game} from "models/game";

const endGame = async (game: Game, winner: "A" | "B"): Promise<void> => {
  const {gameId} = game;
  const $game = await gamesDb.findOne({gameId});

  if (!$game) { return; }

  const {playerA, playerB} = $game;

  const [A, B] = await Promise.all([
    playersDb.findOneAndUpdate({
      name: playerA.name
    }, {
      $set: {
        gameId: 0,
        status: PlayerStatus.ONLINE
      },
      $inc: {
        xp: winner === "A" ? 110 + game.currentTurn : 90 + game.currentTurn,
        "games.ranked.elo": $game.type === "ranked" ? winner === "A" ? 20 : -20 : 0
      }
    }, {
      returnDocument: "after"
    }),
    playersDb.findOneAndUpdate({
      name: playerB.name
    }, {
      $set: {
        gameId: 0,
        status: PlayerStatus.ONLINE
      },
      $inc: {
        xp: winner === "B" ? 110 + game.currentTurn : 90 + game.currentTurn,
        "games.ranked.elo": $game.type === "ranked" ? winner === "B" ? 20 : -20 : 0
      }
    }, {
      returnDocument: "after"
    })
  ]);

  if (!A.value || !B.value) { return; }

  await checkLevelUp(A.value);
  await checkLevelUp(B.value);

  const isDeletedGame = await gamesDb.deleteOne({gameId});

  if (!isDeletedGame.deletedCount) { return; }

  if (winner === "A") {
    ioServer.to(A.value.socketId).emit("notification", "You won!");
    ioServer.to(B.value.socketId).emit("notification", "You lost...");
  } else if (winner === "B") {
    ioServer.to(B.value.socketId).emit("notification", "You won!");
    ioServer.to(A.value.socketId).emit("notification", "You lost...");
  }

  ioServer.to([A.value.socketId, B.value.socketId]).emit("endGame");
};

export {endGame};
