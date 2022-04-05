import {Effect} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const attackMinion: SocketRequest = (services) => {
  const {mongoService, socketService, gameEngine} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socketService.socket.on("attackMinion", async (params) => {
    const {attacked, attacker} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {player, opponent} = gameEngine.getPlayers($game, username);
    const playerMinion = player.minion[attacker];
    const opponentMinion = opponent.minion[attacked];

    if (!playerMinion || !opponentMinion) { return; }
    if (playerMinion.hasAttacked) { return; }

    playerMinion.health -= opponentMinion.damage;
    opponentMinion.health -= playerMinion.damage;
    playerMinion.hasAttacked = true;

    if (!playerMinion.hasTriggeredEffect) {
      if (playerMinion.effects.includes(Effect.CHARGE)) {
        playerMinion.hasAttacked = false;
      }

      playerMinion.hasTriggeredEffect = true;
    }

    if (playerMinion.health <= 0) {
      player.graveyard.push(playerMinion);
      player.minion[attacker] = undefined;
    }

    if (opponentMinion.health <= 0) {
      opponent.graveyard.push(opponentMinion);
      opponent.minion[attacked] = undefined;
    }

    const {playerA, playerB} = $game;
    const updateGame = await $games.updateOne({gameId}, {
      $set: {playerA, playerB}
    });

    if (!updateGame.modifiedCount) { return; }

    socket.emit("attackMinionPlayer", {attacked, attacker});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("attackMinionOpponent", {attacked, attacker});
  });
};
