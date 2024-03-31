import {mongo, server} from "app";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const acceptGame: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$gamePopups, $players} = mongo;

  socket.on("acceptGame", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const id = $player.gamePopupId;
    const $gamePopup = await $gamePopups.findOne({id});

    if (!$gamePopup) {
      return error("Game popup not found.");
    }

    const {type, playerA, playerB} = $gamePopup;

    if (playerA.name === $player.name) {
      if (playerA.hasAccepted) {
        return error("You already accepted this match.");
      }

      if (playerB.hasAccepted) {
        const $gamePopupDelete = await $gamePopups.deleteOne({id});

        if (!$gamePopupDelete.deletedCount) {
          return error("Error deleting game popup.");
        }

        await gameHelpers.startGame(id, type, playerA.name, playerB.name);
      } else {
        const [$gamePopupUpdate, $playerA, $playerB] = await Promise.all([
          $gamePopups.updateOne({id}, {
            $set: {
              "playerA.hasAccepted": true
            }
          }),
          $players.findOne({
            name: playerA.name
          }),
          $players.findOne({
            name: playerB.name
          })
        ]);

        if (!$gamePopupUpdate.modifiedCount || !$playerA || !$playerB) {
          return error("Error fetching players in game popup.");
        }

        socket.emit("acceptGame" as any, {who: "player"});
        server.io.to($playerB.socketId).emit("acceptGame" as any, {who: "opponent"});
      }
    } else if (playerB.name === $player.name) {
      if (playerB.hasAccepted) {
        return error("You already accepted this match.");
      }

      if (playerA.hasAccepted) {
        const $gamePopupDelete = await $gamePopups.deleteOne({id});

        if (!$gamePopupDelete.deletedCount) {
          return error("Error deleting game popup.");
        }

        await gameHelpers.startGame(id, type, playerB.name, playerA.name);
      } else {
        const [$gamePopupUpdate, $playerA, $playerB] = await Promise.all([
          $gamePopups.updateOne({id}, {
            $set: {
              "playerB.hasAccepted": true
            }
          }),
          $players.findOne({
            name: playerA.name
          }),
          $players.findOne({
            name: playerB.name
          })
        ]);

        if (!$gamePopupUpdate.modifiedCount || !$playerA || !$playerB) {
          return error("Error fetching players in game popup.");
        }

        socket.emit("acceptGame" as any, {who: "player"});
        server.io.to($playerA.socketId).emit("acceptGame" as any, {who: "opponent"});
      }
    }
  });
};

export {acceptGame};
