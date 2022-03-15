import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const attackCard: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("attackCard", async (params) => {
    const {attacked, attacker} = params;
    const player = await $players.findOne({socketId});

    if (!player) { return; }

    const {gameId} = player;
    const game = await $games.findOne({gameId});

    if (!game) { return; }

    let opponentUsername: string;
    const endGame = async (winner: "A" | "B"): Promise<void> => {
      const {playerA, playerB} = game;

      const [A, B] = await Promise.all([
        $players.findOneAndUpdate({
          username: playerA.username
        }, {
          $set: {
            gameId: 0,
            status: PlayerStatus.ONLINE
          }
        }, {
          returnDocument: "after"
        }),
        $players.findOneAndUpdate({
          username: playerB.username
        }, {
          $set: {
            gameId: 0,
            status: PlayerStatus.ONLINE
          }
        }, {
          returnDocument: "after"
        })
      ]);

      if (!A.value || !B.value) { return; }

      const isDeletedGame = await $games.deleteOne({gameId});

      if (!isDeletedGame.deletedCount) { return; }

      if (winner === "A") {
        io.to(A.value.socketId).emit("notification", "You won!");
        io.to(B.value.socketId).emit("notification", "You lost...");
      } else if (winner === "B") {
        io.to(B.value.socketId).emit("notification", "You won!");
        io.to(A.value.socketId).emit("notification", "You lost...");
      }

      io.to([A.value.socketId, B.value.socketId]).emit("endGame");
    };

    // ;w;
    if (player.username === game.playerA.username) {
      opponentUsername = game.playerB.username;

      const {playerA, playerB} = game;

      if (attacker === "hero") { // attacking with hero

        if (attacked === "hero") { // attacking hero with hero
          playerA.hero.health -= playerB.hero.damage;
          playerB.hero.health -= playerA.hero.damage;

          if (playerB.hero.health <= 0) {
            await endGame("A");
            return;
          } else if (playerA.hero.health <= 0) {
            await endGame("B");
            return;
          }
        } else { // attacking card with hero
          const attackedCard = playerB.fields[attacked];

          if (
            !attackedCard ||
            !attackedCard.health ||
            !attackedCard.damage
          ) { return; }

          playerA.hero.health -= attackedCard.damage;
          attackedCard.health -= playerA.hero.damage;

          if (playerA.hero.health <= 0) {
            await endGame("B");
            return;
          }

          if (attackedCard.health <= 0) {
            playerB.graveyard.push(attackedCard);
            playerB.fields[attacked] = undefined;
          }
        }
      } else { // attacking with card
        if (attacked === "hero") { // attacking hero with card
          const attackerCard = playerA.fields[attacker];

          if (!attackerCard || !attackerCard.health || !attackerCard.damage) { return; }

          attackerCard.health -= playerB.hero.damage;
          playerB.hero.health -= attackerCard.damage;

          if (playerB.hero.health <= 0) {
            await endGame("A");
            return;
          }

          if (attackerCard.health <= 0) {
            playerA.graveyard.push(attackerCard);
            playerA.fields[attacker] = undefined;
          }
        } else { // attacking card with card
          const attackerCard = playerA.fields[attacker];
          const attackedCard = playerB.fields[attacked];

          if (
            !attackedCard ||
            !attackedCard.health ||
            !attackedCard.damage ||
            !attackerCard ||
            !attackerCard.health ||
            !attackerCard.damage
          ) { return; }

          attackerCard.health -= attackedCard.damage;
          attackedCard.health -= attackerCard.damage;

          if (attackerCard.health <= 0) {
            playerA.graveyard.push(attackerCard);
            playerA.fields[attacker] = undefined;
          }
          if (attackedCard.health <= 0) {
            playerB.graveyard.push(attackedCard);
            playerB.fields[attacked] = undefined;
          }
        }
      }

      await $games.updateOne({gameId}, {$set: {playerA, playerB}});
    } else {
      opponentUsername = game.playerA.username;

      const {playerA, playerB} = game;

      if (attacker === "hero") { // attacking with hero

        if (attacked === "hero") { // attacking hero with hero
          playerB.hero.health -= playerA.hero.damage;
          playerA.hero.health -= playerB.hero.damage;

          if (playerB.hero.health <= 0) {
            await endGame("A");
            return;
          } else if (playerA.hero.health <= 0) {
            await endGame("B");
            return;
          }
        } else { // attacking card with hero
          const attackedCard = playerA.fields[attacked];

          if (
            !attackedCard ||
            !attackedCard.health ||
            !attackedCard.damage
          ) { return; }

          playerB.hero.health -= attackedCard.damage;
          attackedCard.health -= playerB.hero.damage;

          if (playerB.hero.health <= 0) {
            return await endGame("A");
          }
          if (attackedCard.health <= 0) {
            playerA.graveyard.push(attackedCard);
            playerA.fields[attacked] = undefined;
          }
        }
      } else { // attacking with card
        if (attacked === "hero") { // attacking hero with card
          const attackerCard = playerB.fields[attacker];

          if (!attackerCard || !attackerCard.health || !attackerCard.damage) { return; }

          attackerCard.health -= playerA.hero.damage;
          playerA.hero.health -= attackerCard.damage;

          if (playerA.hero.health <= 0) {
            await endGame("B");
            return;
          }

          if (attackerCard.health <= 0) {
            playerB.graveyard.push(attackerCard);
            playerB.fields[attacker] = undefined;
          }
        } else { // attacking card with card
          const attackerCard = playerB.fields[attacker];
          const attackedCard = playerA.fields[attacked];

          if (
            !attackedCard ||
            !attackedCard.health ||
            !attackedCard.damage ||
            !attackerCard ||
            !attackerCard.health ||
            !attackerCard.damage
          ) { return; }

          attackerCard.health -= attackedCard.damage;
          attackedCard.health -= attackerCard.damage;

          if (attackerCard.health <= 0) {
            playerB.graveyard.push(attackerCard);
            playerB.fields[attacker] = undefined;
          }
          if (attackedCard.health <= 0) {
            playerA.graveyard.push(attackedCard);
            playerA.fields[attacked] = undefined;
          }
        }
      }

      await $games.updateOne({gameId}, {$set: {playerA, playerB}});
    }

    socket.emit("attackCardSender", params);

    const opponent = await $players.findOne({
      username: opponentUsername
    });

    if (!opponent || !opponent.socketId) { return; }

    io.to(opponent.socketId).emit("attackCardReceiver", params);
  });
};
