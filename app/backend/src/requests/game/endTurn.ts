import {PlayerStatus} from "@som/shared/enums";
import type {SocketRequest} from "models";

const endTurn: SocketRequest = async (services) => {
  const {gameService, playerService, socketService} = services;
  const {socketId} = socketService;
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
    const card = deck.pop();

    opponentUsername = username;

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

      socketService.emit(A.socketId).notification({msg: "You won!"});
      socketService.emit(A.socketId).endGame();

      socketService.emit(B.socketId).notification({msg: "You lost..."});
      socketService.emit(B.socketId).endGame();

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

      socketService.emit(A.socketId).notification({msg: "You lost..."});
      socketService.emit(A.socketId).endGame();

      socketService.emit(B.socketId).notification({msg: "You won!"});
      socketService.emit(B.socketId).endGame();

      const isDeletedGame = await gameService.delete({gameId});

      if (!isDeletedGame) { return; }

      return;
    }

    hand.push(card);
    hero.mana = 100;

    const currentPlayer = username;

    await gameService.update({gameId}, {$set: {currentPlayer, playerA}});
  }

  socketService.emit().endTurnPlayer();

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  socketService.emit(opponent.socketId).endTurnOpponent();
};

export default endTurn;
