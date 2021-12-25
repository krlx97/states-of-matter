import {game} from "game/stores";
import type {Res} from "models";
import type {AttackCardReceiver} from "./attack-card-receiver.model";

const attackCardReceiver: Res<AttackCardReceiver> = (params) => {
  const {attacker, attacked} = params;

  game.update((store) => {
    const {player, opponent} = store;

    const attackedCard = player.fields[attacked];
    const attackerCard = opponent.fields[attacker];

    attackerCard.health -= attackedCard.damage;
    attackedCard.health -= attackerCard.damage;

    if (attackerCard.health <= 0) {
      opponent.graveyard.push(attackerCard);
      opponent.fields[attacker] = undefined;
    }

    if (attackedCard.health <= 0) {
      player.graveyard.push(attackedCard);
      player.fields[attacked] = undefined;
    }

    return store;
  });
};

export default attackCardReceiver;
