import {PlayerStatus} from "../../../enums/index.js";
import type {Request} from "../../../models";

const endTurn: Request = async (services) => {
  const {gameService, ioService, playerService} = services;
  const {socketId} = ioService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentUsername: string;

  if (player.username === game.playerA.username) {
    const {playerA, playerB} = game;

    if (playerA.username !== game.currentPlayer) { return; }

    const {username, hand, deck, hero} = playerB;
    opponentUsername = username;
    const card = deck.pop();

    if (!card) {
      const [A, B] = await Promise.all([
        playerService.findAndUpdate({
          username: playerA.username
        }, {
          $set: {
            gameId: 0,
            status: PlayerStatus.ONLINE
          }
        }, {
          returnDocument: "after"
        }),
        playerService.findAndUpdate({
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

      if (!A || !B) { return; }

      ioService.emitTo(A.socketId, "notification", {msg: "You won!"});
      ioService.emitTo(A.socketId, "endGame");

      ioService.emitTo(B.socketId, "notification", {msg: "You lost..."});
      ioService.emitTo(B.socketId, "endGame");

      const isDeletedGame = await gameService.delete({gameId});

      if (!isDeletedGame) { return; }

      return;
    }

    hand.push(card);
    hero.mana = 100;

    const currentPlayer = username;

    await gameService.update({gameId}, {$set: {currentPlayer, playerB}});
  } else {
    const {playerA, playerB} = game;

    if (playerB.username !== game.currentPlayer) { return; }

    const {username, hand, deck, hero} = playerA;

    opponentUsername = username;

    const card = deck.pop();

    if (!card) {
      const [A, B] = await Promise.all([
        playerService.findAndUpdate({
          username: playerA.username
        }, {
          $set: {
            gameId: 0,
            status: PlayerStatus.ONLINE
          }
        }, {
          returnDocument: "after"
        }),
        playerService.findAndUpdate({
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

      if (!A || !B) { return; }

      ioService.emitTo(A.socketId, "notification", {msg: "You lost..."});
      ioService.emitTo(A.socketId, "endGame");

      ioService.emitTo(B.socketId, "notification", {msg: "You won!"});
      ioService.emitTo(B.socketId, "endGame");

      const isDeletedGame = await gameService.delete({gameId});

      if (!isDeletedGame) { return; }

      return;
    }

    hand.push(card);
    hero.mana = 100;

    const currentPlayer = username;

    await gameService.update({gameId}, {$set: {currentPlayer, playerA}});
  }

  ioService.emit("endTurnPlayer");

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  ioService.emitTo(opponent.socketId, "endTurnOpponent");
};

export default endTurn;
