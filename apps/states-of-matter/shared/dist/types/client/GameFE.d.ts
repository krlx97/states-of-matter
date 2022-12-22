export interface GameHero {
    name: string;
    klass: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    effects: number[];
}
interface GameCard {
    id: number;
    gid: number;
    klass: number;
    type: number;
    manaCost: number;
    effects: Array<number>;
}
export interface GameMagic extends GameCard {
}
export interface GameMinion extends GameCard {
    damage: number;
    health: number;
    maxHealth: number;
    canAttack: boolean;
    hasTriggeredEffect: boolean;
}
export interface GameTrap extends GameCard {
}
export declare type GameCards = Array<GameMagic | GameMinion | GameTrap>;
interface GameFEPlayer {
    username: string;
    hero: GameHero;
    minion: {
        a: GameMinion | undefined;
        b: GameMinion | undefined;
        c: GameMinion | undefined;
        d: GameMinion | undefined;
    };
    trap: GameTrap | undefined;
    deck: GameCards;
    hand: GameCards;
    graveyard: GameCards;
}
interface GameFEOpponent {
    username: string;
    hero: GameHero;
    minion: {
        a: GameMinion | undefined;
        b: GameMinion | undefined;
        c: GameMinion | undefined;
        d: GameMinion | undefined;
    };
    trap: boolean;
    deck: number;
    hand: number;
    graveyard: GameCards;
}
declare enum LogType {
    ATTACK = 0,
    SUMMON = 1
}
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
    minionKlass: number;
    minionId: number;
}
declare type BattleLogs = Array<AttackLog | SummonLog>;
export interface GameFE {
    gameId: number;
    currentPlayer: string;
    currentTurn: number;
    battleLogs: BattleLogs;
    player: GameFEPlayer;
    opponent: GameFEOpponent;
}
export {};
