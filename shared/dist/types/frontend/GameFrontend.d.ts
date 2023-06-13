import { Ability, CardId, CardKlass, CardType, EffectId, GameType, LogType } from "../../enums/index.js";
type Field = "a" | "b" | "c" | "d";
interface AttackLog {
    type: LogType.ATTACK;
    playerAtk: string;
    playerDef: string;
    with: number;
    target: number;
    attacked: string;
    attacker: string;
}
interface SummonLog {
    type: LogType.SUMMON;
    player: string;
    field: string;
    minionId: number;
}
interface MagicLog {
    type: LogType.MAGIC;
    playerName: string;
    cardId: number;
    text: string;
}
type BattleLog = AttackLog | SummonLog | MagicLog;
type BattleLogs = Array<BattleLog>;
interface BaseCard {
    id: CardId;
    name: string;
    klass: CardKlass;
    effect: EffectId;
}
interface HeroCard extends BaseCard {
    type: CardType.HERO;
    health: number;
    mana: number;
    ability: Ability;
    maxHealth: number;
    maxMana: number;
    buffs: Array<number>;
    debuffs: Array<number>;
}
interface MinionCard extends BaseCard {
    gid: number;
    type: CardType.MINION;
    health: number;
    damage: number;
    manaCost: number;
    maxHealth: number;
    canAttack: boolean;
    buffs: Array<number>;
    debuffs: Array<number>;
}
interface MagicCard extends BaseCard {
    gid: number;
    type: CardType.MAGIC;
    manaCost: number;
}
interface TrapCard extends BaseCard {
    gid: number;
    type: CardType.TRAP;
    manaCost: number;
}
type Card = MinionCard | MagicCard | TrapCard;
type Cards = Array<Card>;
interface SelectedSkin {
    key: number;
    value: number;
}
interface GamePlayer {
    name: string;
    hero: HeroCard;
    minion: {
        a: MinionCard | undefined;
        b: MinionCard | undefined;
        c: MinionCard | undefined;
        d: MinionCard | undefined;
    };
    trap: TrapCard | undefined;
    hand: Cards;
    deck: Cards;
    graveyard: Cards;
    selectedSkins: Array<SelectedSkin>;
}
interface GameOpponent {
    name: string;
    hero: HeroCard;
    minion: {
        a: MinionCard | undefined;
        b: MinionCard | undefined;
        c: MinionCard | undefined;
        d: MinionCard | undefined;
    };
    trap: boolean;
    deck: number;
    hand: number;
    graveyard: Cards;
    selectedSkins: Array<SelectedSkin>;
}
interface GameFrontend {
    id: number;
    type: GameType;
    currentPlayer: string;
    currentTurn: number;
    gameLogs: BattleLogs;
    player: GamePlayer;
    opponent: GameOpponent;
}
export { Field };
export type { GameFrontend, Card, BattleLogs, BattleLog };
