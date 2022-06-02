import {lobbiesDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const startCustomGame: SocketEvent = (socket): void => {
  socket.on("startGame", async (params) => {
    const {lobbyId} = params;
    const lobby = await lobbiesDb.findOne({lobbyId});
    const deleteLobby = await lobbiesDb.deleteOne({lobbyId});

    if (!lobby || !deleteLobby.deletedCount) { return; }

    const {host, challengee} = lobby;

    await gameEngine.startGame("custom", host.username, challengee.username);
  });
};

export {startCustomGame};
