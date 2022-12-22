import {CardKlass} from "@som/shared/enums";

const heroAbilities = new Map<CardKlass, string>([
  [CardKlass.SOLID,   "Give one Solid Minion +2 FORTIFY"],
  [CardKlass.LIQUID,  "CLEANSE any minion, if allied remove all debuffs, if enemy remove all buffs"],
  [CardKlass.GAS,     "soon"],
  [CardKlass.PLASMA,  "soon"]
]);

export {heroAbilities};
