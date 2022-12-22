import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const unhoverCard: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unhoverCard", async () => {
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {name, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== name) { return; }

    const {opponent} = gameEngine.getPlayers($game, name);
    const $opponent = await playersDb.findOne({
      name: opponent.name
    });

    if (!$opponent || !$opponent.socketId) { return; }

    ioServer.to($opponent.socketId).emit("unhoverCard");
  });
};

export {unhoverCard};
