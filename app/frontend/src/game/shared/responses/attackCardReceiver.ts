import {gameStore} from "game/stores";

import type {AttackCardReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const attackCardReceiver: Res<AttackCardReceiverRes> = (params) => {
  const {attacker, attacked} = params;

  gameStore.update((store) => {
    const {player, opponent} = store;

    if (attacker === "hero") { // attacking with hero
      if (attacked === "hero") { // attacking hero with hero
        player.hero.health -= opponent.hero.damage;
        opponent.hero.health -= player.hero.damage;
      } else { // attacking card with hero
        const attackedCard = player.fields[attacked];

        opponent.hero.health -= attackedCard.damage;
        attackedCard.health -= opponent.hero.damage;

        if (attackedCard.health <= 0) {
          player.graveyard.push(attackedCard);
          player.fields[attacked] = undefined;
        }
      }
    } else { // attacking with card
      if (attacked === "hero") { // attacking hero with card
        const attackerCard = opponent.fields[attacker];

        attackerCard.health -= player.hero.damage;
        player.hero.health -= attackerCard.damage;

        if (attackerCard.health <= 0) {
          opponent.graveyard.push(attackerCard);
          opponent.fields[attacker] = undefined;
        }
      } else { // attacking card with card
        const attackerCard = opponent.fields[attacker];
        const attackedCard = player.fields[attacked];

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
      }
    }

    return store;
  });
};

export default attackCardReceiver;
