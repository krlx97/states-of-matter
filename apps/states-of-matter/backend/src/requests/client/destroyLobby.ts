import {PlayerStatus} from "@som/shared/enums";
import {lobbiesDb, playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import type {SocketEvent} from "models";

const destroyLobby: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("destroyLobby", async () => {
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {name, lobbyId} = player;

    if (!lobbyId) {
      socket.emit("notification", "You are not in a lobby.");
      return;
    }

    const lobby = await lobbiesDb.findOne({lobbyId});

    if (!lobby) { return; }

    if (name !== lobby.host.name) {
      socket.emit("notification", "You are not the lobby host.");
      return;
    }

    const [deleteLobby, updatePlayer] = await Promise.all([
      lobbiesDb.deleteOne({lobbyId}),
      playersDb.updateOne({socketId}, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (!deleteLobby.deletedCount || !updatePlayer.modifiedCount) { return; }

    if (lobby.challengee.name) {
      const challengee = await playersDb.findOneAndUpdate({
        name: lobby.challengee.name
      }, {
        $set: {
          lobbyId: 0,
          status: PlayerStatus.ONLINE
        }
      }, {
        returnDocument: "after"
      });

      if (!challengee.value) { return; }
    }

    socket.emit("destroyLobby");
    ioServer.to(lobby.challengee.socketId).emit("destroyLobby");
  });
};

export {destroyLobby};
