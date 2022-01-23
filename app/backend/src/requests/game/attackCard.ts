import {PlayerStatus} from "@som/shared/enums";
import type {AttackCardReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const attackCard: SocketRequest<AttackCardReq> = async (services, params) => {
  const {gameService, playerService, socketService} = services;
  const {attacked, attacker} = params;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentUsername: string;
  const endGame = async (winner: "A" | "B"): Promise<void> => {
    const {playerA, playerB} = game;

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

    const isDeletedGame = await gameService.delete({gameId});

    if (!isDeletedGame) { return; }

    if (winner === "A") {
      socketService.emit(A.socketId).notification({msg: "You won!"});
      socketService.emit(B.socketId).notification({msg: "You lost..."});
    } else if (winner === "B") {
      socketService.emit(B.socketId).notification({msg: "You won!"});
      socketService.emit(A.socketId).notification({msg: "You lost..."});
    }

    socketService.emit(A.socketId).endGame();
    socketService.emit(B.socketId).endGame();
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

    await gameService.update({gameId}, {$set: {playerA, playerB}});
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
          await endGame("A");
          return;
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

    await gameService.update({gameId}, {$set: {playerA, playerB}});
  }

  socketService.emit().attackCardSender(params);

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  socketService.emit(opponent.socketId).attackCardReceiver(params);
};

export default attackCard;
