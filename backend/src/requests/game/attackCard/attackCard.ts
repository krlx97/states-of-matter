import type {Request} from "../../../models";
import type {AttackCard} from "./attack-card.model";

const attackCard: Request<AttackCard> = async (services, params) => {
  const {gameService, ioService, playerService} = services;
  const {attacked, attacker} = params;
  const {socketId} = ioService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentUsername: string;

  if (player.username === game.playerA.username) {
    opponentUsername = game.playerB.username;

    const {playerA, playerB} = game;

    const attackerCard = playerA.fields[attacker];
    const attackedCard = playerB.fields[attacked];

    if (
      !attackerCard ||
      !attackedCard ||
      !attackerCard.health ||
      !attackerCard.damage ||
      !attackedCard.health ||
      !attackedCard.damage
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

    await gameService.update({gameId}, {$set: {playerA, playerB}});
  } else {
    opponentUsername = game.playerA.username;

    const {playerA, playerB} = game;

    const attackerCard = playerB.fields[attacker];
    const attackedCard = playerA.fields[attacked];

    if (
      !attackerCard ||
      !attackedCard ||
      !attackerCard.health ||
      !attackerCard.damage ||
      !attackedCard.health ||
      !attackedCard.damage
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

    await gameService.update({gameId}, {$set: {playerA, playerB}});
  }

  ioService.emit("attackCardSender", params);

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  ioService.emitTo(opponent.socketId, "attackCardReceiver", params);
};

export default attackCard;
