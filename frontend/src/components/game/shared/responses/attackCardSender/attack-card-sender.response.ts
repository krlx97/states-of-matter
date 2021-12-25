import {game} from "game/stores";
import type {Res} from "models";
import type {AttackCardSender} from "./attack-card-sender.model";

const attackCardSender: Res<AttackCardSender> = (params) => {
  const {attacker, attacked} = params;

  game.update((store) => {
    const {player, opponent} = store;

    const attackerCard = player.fields[attacker];
    const attackedCard = opponent.fields[attacked];

    attackerCard.health -= attackedCard.damage;
    attackedCard.health -= attackerCard.damage;

    if (attackerCard.health <= 0) {
      player.graveyard.push(attackerCard);
      player.fields[attacker] = undefined;
    }

    if (attackedCard.health <= 0) {
      opponent.graveyard.push(attackedCard);
      opponent.fields[attacked] = undefined;
    }

    return store;
  });
};

export default attackCardSender;
