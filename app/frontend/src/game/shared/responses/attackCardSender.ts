import {gameStore} from "game/stores";

import type {AttackCardSenderRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const attackCardSender: Res<AttackCardSenderRes> = (params) => {
  const {attacker, attacked} = params;

  gameStore.update((store) => {
    const {player, opponent} = store;

    if (attacker === "hero") { // attacking with hero
      if (attacked === "hero") { // attacking hero with hero
        player.hero.health -= opponent.hero.damage;
        opponent.hero.health -= player.hero.damage;
      } else { // attacking card with hero
        const attackedCard = opponent.fields[attacked];

        player.hero.health -= attackedCard.damage;
        attackedCard.health -= player.hero.damage;

        if (attackedCard.health <= 0) {
          opponent.graveyard.push(attackedCard);
          opponent.fields[attacked] = undefined;
        }
      }
    } else { // attacking with card
      if (attacked === "hero") { // attacking hero with card
        const attackerCard = player.fields[attacker];

        attackerCard.health -= opponent.hero.damage;
        opponent.hero.health -= attackerCard.damage;

        if (attackerCard.health <= 0) {
          player.graveyard.push(attackerCard);
          player.fields[attacker] = undefined;
        }
      } else { // attacking card with card
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
      }
    }

    return store;
  });
};

export default attackCardSender;
