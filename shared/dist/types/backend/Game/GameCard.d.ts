import type { CardId, CardKlass, EffectId } from "../../../enums/index.js";
interface GameCard {
    id: CardId;
    gid: number;
    klass: CardKlass;
    effect: EffectId;
}
export { GameCard };
