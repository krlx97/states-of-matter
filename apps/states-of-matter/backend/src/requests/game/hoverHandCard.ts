import {gamesDb, playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const hoverHandCard: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("hoverHandCard", async (params) => {
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

    ioServer.to($opponent.socketId).emit("hoverHandCard", params);
  });
};

export {hoverHandCard};
