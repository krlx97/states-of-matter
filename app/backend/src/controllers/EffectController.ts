import {GameMinion} from "@som/shared/dist/interfaces/mongo/Game";
import {Effect} from "@som/shared/enums";

export class EffectController {
  public check () {}
  public charge (minion: GameMinion) {
    if (minion.effects.includes(Effect.CHARGE) && !minion.hasTriggeredEffect) {
      minion.hasAttacked = false;
      minion.hasTriggeredEffect = true;
    }
  }
}
