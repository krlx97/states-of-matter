// import type {Card} from "models/view";
import {CardKlass, CardType} from "../enums/index.js";

interface Card {
  id: number;
  klass: CardKlass;
  type: CardType;
  damage?: number;
  health?: number;
  maxHealth?: number;
  manaCost: number;
}

const cards: Array<Card> = [{
  id: 0,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 1,
  health: 1,
  manaCost: 1
}, {
  id: 1,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 2,
  health: 2,
  manaCost: 2
}, {
  id: 2,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 3,
  health: 3,
  manaCost: 3
}, {
  id: 3,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 4,
  health: 4,
  manaCost: 4
}, {
  id: 4,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 5,
  health: 5,
  manaCost: 5
}, {
  id: 5,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  damage: 6,
  health: 6,
  manaCost: 6
}, {
  id: 6,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  manaCost: 7
}, {
  id: 7,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  manaCost: 8
}, {
  id: 8,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  manaCost: 9
}, {
  id: 9,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  manaCost: 10
}, {
  id: 10,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  manaCost: 11
}, {
  id: 11,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  manaCost: 12
}, {
  id: 50,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 1,
  health: 1,
  manaCost: 1
}, {
  id: 51,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 2,
  health: 2,
  manaCost: 2
}, {
  id: 52,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 3,
  health: 3,
  manaCost: 3
}, {
  id: 53,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 4,
  health: 4,
  manaCost: 4
}, {
  id: 54,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 5,
  health: 5,
  manaCost: 5
}, {
  id: 55,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  damage: 6,
  health: 6,
  manaCost: 6
}, {
  id: 56,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  manaCost: 7
}, {
  id: 57,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  manaCost: 8
}, {
  id: 58,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  manaCost: 9
}, {
  id: 59,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  manaCost: 10
}, {
  id: 60,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  manaCost: 11
}, {
  id: 61,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  manaCost: 12
}, {
  id: 100,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 1,
  health: 1,
  manaCost: 1
}, {
  id: 101,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 2,
  health: 2,
  manaCost: 2
}, {
  id: 102,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 3,
  health: 3,
  manaCost: 3
}, {
  id: 103,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 4,
  health: 4,
  manaCost: 4
}, {
  id: 104,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 5,
  health: 5,
  manaCost: 5
}, {
  id: 105,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  damage: 6,
  health: 6,
  manaCost: 6
}, {
  id: 106,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  manaCost: 7
}, {
  id: 107,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  manaCost: 8
}, {
  id: 108,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  manaCost: 9
}, {
  id: 109,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  manaCost: 10
}, {
  id: 110,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  manaCost: 11
}, {
  id: 111,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  manaCost: 12
}, {
  id: 150,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 1,
  health: 1,
  manaCost: 1
}, {
  id: 151,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 2,
  health: 2,
  manaCost: 2
}, {
  id: 152,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 3,
  health: 3,
  manaCost: 3
}, {
  id: 153,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 4,
  health: 4,
  manaCost: 4
}, {
  id: 154,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 5,
  health: 5,
  manaCost: 5
}, {
  id: 155,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  damage: 6,
  health: 6,
  manaCost: 6
}, {
  id: 156,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  manaCost: 7
}, {
  id: 157,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  manaCost: 8
}, {
  id: 158,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  manaCost: 9
}, {
  id: 159,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  manaCost: 10
}, {
  id: 160,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  manaCost: 11
}, {
  id: 161,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  manaCost: 12
}, {
  id: 200,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 1,
  health: 1,
  manaCost: 1
}, {
  id: 201,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 2,
  health: 2,
  manaCost: 2
}, {
  id: 202,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 3,
  health: 3,
  manaCost: 3
}, {
  id: 203,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 4,
  health: 4,
  manaCost: 4
}, {
  id: 204,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 5,
  health: 5,
  manaCost: 5
}, {
  id: 205,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  damage: 6,
  health: 6,
  manaCost: 6
}, {
  id: 206,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  manaCost: 7
}, {
  id: 207,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  manaCost: 8
}, {
  id: 208,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  manaCost: 9
}, {
  id: 209,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  manaCost: 10
}, {
  id: 210,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  manaCost: 11
}, {
  id: 211,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  manaCost: 12
}];

export default cards;
