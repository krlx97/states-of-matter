import {PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "apis";
import type {SocketRequest} from "@som/shared/types/backend";

const declineGame: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {gamePopups, players} = mongo;
  const {io} = server;

  socket.on("declineGame", async () => {
    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const id = $player.gamePopupId;
    const $gamePopup = await gamePopups.findOne({id});

    if (!$gamePopup) {
      return error("Game popup not found.");
    }

    const {playerA, playerB} = $gamePopup;
    const [$gamePopupDelete, $playerA, $playerB] = await Promise.all([
      gamePopups.deleteOne({id}),
      players.findOneAndUpdate({
        name: playerA.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      }, {
        returnDocument: "after"
      }),
      players.findOneAndUpdate({
        name: playerB.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      }, {
        returnDocument: "after"
      })
    ]);

    if (!$gamePopupDelete.deletedCount) {
      return error("Failed to delete game popup.");
    }
    if (!$playerA.value) {
      return error("Player A in popup not found / updated.");
    }
    if (!$playerB.value) {
      return error("Player B in popup not found / updated.");
    }

    io.to([
      $playerA.value.socketId,
      $playerB.value.socketId
    ]).emit("declineGame");
  });
};

export {declineGame};
