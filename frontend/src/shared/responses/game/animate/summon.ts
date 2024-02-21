import {soundService} from "services";
import {gameStore} from "stores";
import { EffectId } from "@som/shared/enums";

const summon = (animation: any): void => {
  const {name, field, minion, necromancyFixPositive} = animation;

  // fix for necromancy animations
  // card already has attributes changed, need to revert them back and animate them.
  if (necromancyFixPositive !== undefined && necromancyFixPositive === true && minion.effect === EffectId.NECROMANCY) {
    minion.health.current -= 2;
    minion.damage.current -= 2;
  } else if (necromancyFixPositive !== undefined && necromancyFixPositive === false && minion.effect === EffectId.NECROMANCY) {
    minion.health.current += 2;
    minion.damage.current += 2;
  }

  gameStore.update((store) => {
    if (store.player.name === name) {
      const index = store.player.hand.indexOf(minion);
      store.player.hand.splice(index, 1);
      store.player.field[field] = minion;
    } else {
      store.opponent.hand -= 1;
      store.opponent.field[field] = minion;
    }

    return store;
  });

  soundService.play("summon");
};

export {summon};
