import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

export const endTurn: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("endTurn", async () => {
    const player = await $players.findOne({socketId});

    if (!player) { return; }

    const {gameId} = player;
    const game = await $games.findOne({gameId});

    if (!game) { return; }

    let opponentUsername: string;

    if (player.username === game.playerA.username) {
      const {playerA, playerB} = game;

      if (playerA.username !== game.currentPlayer) { return; }

      const {username, hand, deck, hero} = playerB;
      const card = deck.pop();

      opponentUsername = username;

      if (!card) {
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

        io.to(A.value.socketId).emit("notification", "You won!");
        io.to(B.value.socketId).emit("notification", "You lost...");
        io.to([A.value.socketId, B.value.socketId]).emit("endGame");

        const isDeletedGame = await $games.deleteOne({gameId});

        if (!isDeletedGame.deletedCount) { return; }

        return;
      }

      hand.push(card);
      hero.mana = 100;

      const currentPlayer = username;

      await $games.updateOne({gameId}, {$set: {currentPlayer, playerB}});
    } else {
      const {playerA, playerB} = game;

      if (playerB.username !== game.currentPlayer) { return; }

      const {username, hand, deck, hero} = playerA;

      opponentUsername = username;

      const card = deck.pop();

      if (!card) {
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

        io.to(A.value.socketId).emit("notification", "You lost...");
        io.to(B.value.socketId).emit("notification", "You won!");
        io.to([A.value.socketId, B.value.socketId]).emit("endGame");

        const isDeletedGame = await $games.deleteOne({gameId});

        if (!isDeletedGame.deletedCount) { return; }

        return;
      }

      hand.push(card);
      hero.mana = 100;

      const currentPlayer = username;

      await $games.updateOne({gameId}, {$set: {currentPlayer, playerA}});
    }

    socket.emit("endTurnPlayer");

    const opponent = await $players.findOne({
      username: opponentUsername
    });

    if (!opponent || !opponent.socketId) { return; }

    io.to(opponent.socketId).emit("endTurnOpponent");
  });
};
