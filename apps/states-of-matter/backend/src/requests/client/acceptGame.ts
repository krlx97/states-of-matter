import {playersDb, preGamesDb} from "apis/mongo";
import { ioServer } from "apis/server";
import gameEngine from "helpers/game";
import {SocketEvent} from "models";

const acceptGame: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("acceptGame", async (params) => {
    const {gameId} = params;
    const gamePopup = await preGamesDb.findOne({gameId});

    if (!gamePopup) {
      socket.emit("notification", "Game popup not found.");
      return;
    }

    const [playerA, playerB, player] = await Promise.all([
      playersDb.findOne({name: gamePopup.playerA.name}),
      playersDb.findOne({name: gamePopup.playerB.name}),
      playersDb.findOne({socketId})
    ]);

    if (!playerA || !playerB || !player) {
      socket.emit("notification", "Player not found.");
      return;
    }

    if (gamePopup.playerA.name === player.name) {
      if (gamePopup.playerB.hasAccepted) {
        await gameEngine.startGame("casual", gamePopup.playerA.name, gamePopup.playerB.name, gamePopup.gameId);
        // remove the game popup before starting the game
        return;
      }

      gamePopup.playerA.hasAccepted = true;
    } else if (gamePopup.playerB.name === player.name) {
      if (gamePopup.playerA.hasAccepted) {
        await gameEngine.startGame("casual", gamePopup.playerB.name, gamePopup.playerA.name, gamePopup.gameId);
        // remove the game popup before starting the game
        return;
      }

      gamePopup.playerB.hasAccepted = true;
    }

    const repl = await preGamesDb.replaceOne({gameId: gamePopup.gameId}, gamePopup);

    if (!repl.modifiedCount) {
      socket.emit("notification", "Error replacing game popup.");
      return;
    }

    ioServer.to(playerA.socketId).emit("acceptGame");
    ioServer.to(playerB.socketId).emit("acceptGame");
  });
};

export {acceptGame};
