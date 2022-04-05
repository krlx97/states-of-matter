import {SocketRequest} from "models";

export const attackHero: SocketRequest = (services) => {
  const {mongoService, socketService, gameEngine} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("attackHero", async (params) => {
    const {attacker} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {player, opponent} = gameEngine.getPlayers($game, username);
    const playerMinion = player.minion[attacker];
    const opponentHero = opponent.hero;

    if (!playerMinion) { return; }
    if (playerMinion.hasAttacked) { return; }

    // playerMinion.health -= opponentHero.damage;
    opponentHero.health -= playerMinion.damage;
    playerMinion.hasAttacked = true;

    if (await gameEngine.isGameOver($game)) { return; }

    // if (playerMinion.health <= 0) {
    //   player.graveyard.push(playerMinion);
    //   player.minion[attacker] = undefined;
    // }

    const {playerA, playerB} = $game;
    const updateGame = await $games.updateOne({gameId}, {
      $set: {playerA, playerB}
    });

    if (!updateGame.modifiedCount) { return; }

    socket.emit("attackHero|player", {attacker});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("attackHero|opponent", {attacker});
  });
};
