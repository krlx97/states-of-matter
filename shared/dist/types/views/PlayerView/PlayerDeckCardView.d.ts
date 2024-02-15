import { CardKlass, CardType } from "../../../enums/index.js";
interface PlayerDeckBaseCardView {
    id: number;
    name: string;
    klass: CardKlass;
    amount: number;
    manaCost: number;
}
interface PlayerDeckMinionCardView extends PlayerDeckBaseCardView {
    type: CardType.MINION;
    damage: number;
    health: number;
}
interface PlayerDeckMagicCardView extends PlayerDeckBaseCardView {
    type: CardType.MAGIC;
}
interface PlayerDeckTrapCardView extends PlayerDeckBaseCardView {
    type: CardType.TRAP;
}
type PlayerDeckCardView = PlayerDeckMinionCardView | PlayerDeckMagicCardView | PlayerDeckTrapCardView;
export type { PlayerDeckCardView };
