import {mongo, server} from "apis";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const acceptGame: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {gamePopups, players} = mongo;
  const {io} = server;

  socket.on("acceptGame", async () => {
    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const id = $player.gamePopupId;
    const $gamePopup = await gamePopups.findOne({id});

    if (!$gamePopup) {
      return error("Game popup not found.");
    }

    const {type, playerA, playerB} = $gamePopup;

    if (playerA.hasAccepted || playerB.hasAccepted) {
      const $gamePopupDelete = await gamePopups.deleteOne({id});

      if (!$gamePopupDelete.deletedCount) {
        return error("Error deleting game popup.");
      }

      await gameEngine.startGame(id, type, playerA.name, playerB.name);
    } else {
      if (playerA.name === $player.name) {
        playerA.hasAccepted = true;
      } else if (playerB.name === $player.name) {
        playerB.hasAccepted = true;
      }

      const [$playerA, $playerB, $gamePopupReplace] = await Promise.all([
        players.findOne({
          name: playerA.name
        }),
        players.findOne({
          name: playerB.name
        }),
        gamePopups.replaceOne({id}, $gamePopup)
      ]);

      if (!$playerA || !$playerB) {
        return error("Player A in popup not found.");
      }
      if (!$playerB) {
        return error("Player B in popup not found.");
      }
      if (!$gamePopupReplace.modifiedCount) {
        return error("Error replacing game popup.");
      }

      io.to([$playerA.socketId, $playerB.socketId]).emit("acceptGame");
    }
  });
};

export {acceptGame};
