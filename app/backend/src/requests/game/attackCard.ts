import { Effect } from "@som/shared/enums";
import type {SocketRequest} from "models";

export const attackCard: SocketRequest = (services) => {
  const {mongoService, socketService, gameEngine} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("attackCard", async (params) => {
    const {attacked, attacker} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {playerA, playerB} = $game;
    const {player, opponent} = gameEngine.getPlayerOpponent($player.username, $game);
    const playerCard = player.fields[attacker];
    const opponentCard = opponent.fields[attacked];

    if (!playerCard || !opponentCard) { return; }
    if (playerCard.hasAttacked) { return; }

    playerCard.health -= opponentCard.damage;
    opponentCard.health -= playerCard.damage;
    playerCard.hasAttacked = true;

    if (playerCard.effects.includes(Effect.CHARGE)) {
      playerCard.hasAttacked = false;
      playerCard.hasTriggeredEffect = false;
    }

    if (await gameEngine.isGameOver($game)) { return; }

    if (playerCard.health <= 0 && attacker !== "hero") {
      const {gid, id} = playerCard;

      player.graveyard.push(playerCard);
      player.fields[attacker] = undefined;
    }

    if (opponentCard.health <= 0 && attacked !== "hero") {
      const {gid, id} = opponentCard;

      opponent.graveyard.push({gid, id});
      opponent.fields[attacked] = undefined;
    }

    await $games.updateOne({gameId}, {$set: {playerA, playerB}});

    socket.emit("attackCardSender", {attacked, attacker});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("attackCardReceiver", {attacked, attacker});
  });
};
