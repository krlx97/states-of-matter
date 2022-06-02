import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const unhoverHandCard: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unhoverHandCard", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== username) { return; }

    const {opponent} = gameEngine.getPlayers($game, username);
    const $opponent = await playersDb.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    ioServer.to($opponent.socketId).emit("unhoverHandCard");
  });
};

export {unhoverHandCard};
