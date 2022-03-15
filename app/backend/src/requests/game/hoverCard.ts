import {SocketRequest} from "models";

export const hoverCard: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("hoverCard", async (params) => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    let opponentName: string;

    if ($game.playerA.username === $player.username) {
      opponentName = $game.playerB.username;
    } else {
      opponentName = $game.playerA.username;
    }

    const opponent = await $players.findOne({
      username: opponentName
    });

    if (!opponent || !opponent.socketId) { return; }

    io.to(opponent.socketId).emit("hoverCard", params);
  });
};
