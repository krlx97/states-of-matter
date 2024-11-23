import type {CardId, CardKlass, EffectId} from "../../../enums/index.js";

interface GameBaseCard {
  id: CardId;
  gid: number;
  klass: CardKlass;
  effect: EffectId;
}

export type {GameBaseCard};
