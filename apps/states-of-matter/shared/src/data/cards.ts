import {
  Ability,
  CardId,
  CardKlass,
  CardType,
  EffectId,
  EffectType
} from "../enums/index.js";

import type {Cards} from "../types/game/index.js";

const cards: Cards = [
  {// ----- Heroes -----
    id: CardId.SOLID_HERO,
    name: "Solid Hero",
    klass: CardKlass.SOLID,
    type: CardType.HERO,
    health: 20,
    mana: 10,
    ability: Ability.SOLID
  }, {
    id: CardId.LIQUID_HERO,
    name: "Liquid Hero",
    klass: CardKlass.LIQUID,
    type: CardType.HERO,
    health: 20,
    mana: 10,
    ability: Ability.LIQUID
  }, {
    id: CardId.GAS_HERO,
    name: "Gas Hero",
    klass: CardKlass.GAS,
    type: CardType.HERO,
    health: 20,
    mana: 10,
    ability: Ability.GAS
  }, {
    id: CardId.PLASMA_HERO,
    name: "Plasma Hero",
    klass: CardKlass.PLASMA,
    type: CardType.HERO,
    health: 20,
    mana: 10,
    ability: Ability.PLASMA
  }, { // ----- Neutral -----
    id: CardId.SEAFARER,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Seafarer",
    damage: 9,
    health: 5,
    manaCost: 4,
    effect: {
      id: EffectId.CHARGE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.AVET,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Avet",
    damage: 7,
    health: 7,
    manaCost: 6,
    effect: {
      id: EffectId.QUICK_SHOT,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GUIDING_LIGHTS,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Guiding Lights",
    damage: 3,
    health: 9,
    manaCost: 5,
    effect: {
      id: EffectId.MULTI_STRIKE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.VESSELS,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Vessels",
    damage: 6,
    health: 6,
    manaCost: 6,
    effect: {
      id: EffectId.NECRO,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.EARTHS_BELOVED,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Earth's Loved",
    damage: 5,
    health: 9,
    manaCost: 8,
    effect: {
      id: EffectId.SPELLWEAVE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PILGRIMS,
    klass: CardKlass.NEUTRAL,
    type: CardType.MINION,
    name: "Pilgrims",
    damage: 1,
    health: 9,
    manaCost: 8,
    effect: {
      id: EffectId.PUPPETEER,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.REBIRTH,
    klass: CardKlass.NEUTRAL,
    type: CardType.MAGIC,
    name: "Rebirth",
    manaCost: 9,
    effect: {
      id: EffectId.REBIRTH,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.EXHAUST,
    klass: CardKlass.NEUTRAL,
    type: CardType.MAGIC,
    name: "Exhaust",
    manaCost: 4,
    effect: {
      id: EffectId.EXHAUST,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.RELOAD,
    klass: CardKlass.NEUTRAL,
    type: CardType.MAGIC,
    name: "Reload",
    manaCost: 3,
    effect: {
      id: EffectId.RELOAD,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.MIRRORS_EDGE,
    klass: CardKlass.NEUTRAL,
    type: CardType.TRAP,
    name: "Mirrors Edge",
    manaCost: 4,
    effect: {
      id: EffectId.MIRRORS_EDGE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SMITE,
    klass: CardKlass.NEUTRAL,
    type: CardType.TRAP,
    name: "Smite",
    manaCost: 5,
    effect: {
      id: EffectId.SMITE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.ANTI_MAGE,
    klass: CardKlass.NEUTRAL,
    type: CardType.TRAP,
    name: "Anti-Mage",
    manaCost: 4,
    effect: {
      id: EffectId.ANTI_MAGE,
      type: EffectType.PASSIVE
    }
  }, { // ----- Solid -----
    id: CardId.SOLID_1,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Dendrites",
    damage: 1,
    health: 1,
    manaCost: 1,
    effect: {
      id: EffectId.SMITH,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_2,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Gnomes",
    damage: 2,
    health: 2,
    manaCost: 2,
    effect: {
      id: EffectId.INITIATIVE,
      type: EffectType.PASSIVE,
    }
  }, {
    id: CardId.SOLID_3,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Mud Spirit",
    damage: 3,
    health: 3,
    manaCost: 3,
    effect: {
      id: EffectId.MITIGATE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_4,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Peacemaker",
    damage: 4,
    health: 4,
    manaCost: 4,
    effect: {
      id: EffectId.SHIELDWALL,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_5,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Golemica",
    damage: 5,
    health: 5,
    manaCost: 5,
    effect: {
      id: EffectId.BREAK,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.SOLID_6,
    klass: CardKlass.SOLID,
    type: CardType.MINION,
    name: "Cave Lion",
    damage: 6,
    health: 6,
    manaCost: 6,
    effect: {
      id: EffectId.BOND,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_7,
    klass: CardKlass.SOLID,
    type: CardType.MAGIC,
    name: "Solid card 7",
    manaCost: 7,
    effect: {
      id: EffectId.SSPELL1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_8,
    klass: CardKlass.SOLID,
    type: CardType.MAGIC,
    name: "Solid card 8",
    manaCost: 8,
    effect: {
      id: EffectId.SSPELL2,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.SOLID_9,
    klass: CardKlass.SOLID,
    type: CardType.MAGIC,
    name: "Solid card 9",
    manaCost: 9,
    effect: {
      id: EffectId.SSPELL3,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.SOLID_10,
    klass: CardKlass.SOLID,
    type: CardType.TRAP,
    name: "Solid card 10",
    manaCost: 10,
    effect: {
      id: EffectId.REDIRECT,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_11,
    klass: CardKlass.SOLID,
    type: CardType.TRAP,
    name: "Solid card 11",
    manaCost: 11,
    effect: {
      id: EffectId.BULWARK,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.SOLID_12,
    klass: CardKlass.SOLID,
    type: CardType.TRAP,
    name: "Solid card 12",
    manaCost: 12,
    effect: {
      id: EffectId.STRAP3,
      type: EffectType.PASSIVE
    }
  }, { // ----- Liquid -----
    id: CardId.LIQUID_1,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 1",
    damage: 1,
    health: 1,
    manaCost: 1,
    effect: {
      id: EffectId.HEAL,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_2,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 2",
    damage: 2,
    health: 2,
    manaCost: 2,
    effect: {
      id: EffectId.RADIATING_HEAL,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.LIQUID_3,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 3",
    damage: 3,
    health: 3,
    manaCost: 3,
    effect: {
      id: EffectId.IMBUE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.LIQUID_4,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 4",
    damage: 4,
    health: 4,
    manaCost: 4,
    effect: {
      id: EffectId.SACRIFICE,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_5,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 5",
    damage: 5,
    health: 5,
    manaCost: 5,
    effect: {
      id: EffectId.VIVIFY,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.LIQUID_6,
    klass: CardKlass.LIQUID,
    type: CardType.MINION,
    name: "Liquid card 6",
    damage: 6,
    health: 6,
    manaCost: 6,
    effect: {
      id: EffectId.CLEANSE,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_7,
    klass: CardKlass.LIQUID,
    type: CardType.MAGIC,
    name: "Liquid card 7",
    manaCost: 7,
    effect: {
      id: EffectId.SWAP,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_8,
    klass: CardKlass.LIQUID,
    type: CardType.MAGIC,
    name: "Liquid card 8",
    manaCost: 8,
    effect: {
      id: EffectId.LINK,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_9,
    klass: CardKlass.LIQUID,
    type: CardType.MAGIC,
    name: "Liquid card 9",
    manaCost: 9,
    effect: {
      id: EffectId.CONTROL,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_10,
    klass: CardKlass.LIQUID,
    type: CardType.TRAP,
    name: "Liquid card 10",
    manaCost: 10,
    effect: {
      id: EffectId.CLEANSING_WATERS,
      type: EffectType.ACTIVE
    }
  }, {
    id: CardId.LIQUID_11,
    klass: CardKlass.LIQUID,
    type: CardType.TRAP,
    name: "Liquid card 11",
    manaCost: 11,
    effect: {
      id: EffectId.LTRAP2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.LIQUID_12,
    klass: CardKlass.LIQUID,
    type: CardType.TRAP,
    name: "Liquid card 12",
    manaCost: 12,
    effect: {
      id: EffectId.LTRAP3,
      type: EffectType.PASSIVE
    }
  }, { // ----- Gas -----
    id: CardId.GAS_1,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 1",
    damage: 1,
    health: 1,
    manaCost: 1,
    effect: {
      id: EffectId.GMINION1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_2,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 2",
    damage: 2,
    health: 2,
    manaCost: 2,
    effect: {
      id: EffectId.GMINION2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_3,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 3",
    damage: 3,
    health: 3,
    manaCost: 3,
    effect: {
      id: EffectId.GMINION3,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_4,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 4",
    damage: 4,
    health: 4,
    manaCost: 4,
    effect: {
      id: EffectId.GMINION4,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_5,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 5",
    damage: 5,
    health: 5,
    manaCost: 5,
    effect: {
      id: EffectId.GMINION5,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_6,
    klass: CardKlass.GAS,
    type: CardType.MINION,
    name: "Gas card 6",
    damage: 6,
    health: 6,
    manaCost: 6,
    effect: {
      id: EffectId.GMINION6,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_7,
    klass: CardKlass.GAS,
    type: CardType.MAGIC,
    name: "Gas card 7",
    manaCost: 7,
    effect: {
      id: EffectId.GMAGIC1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_8,
    klass: CardKlass.GAS,
    type: CardType.MAGIC,
    name: "Gas card 8",
    manaCost: 8,
    effect: {
      id: EffectId.GMAGIC2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_9,
    klass: CardKlass.GAS,
    type: CardType.MAGIC,
    name: "Gas card 9",
    manaCost: 9,
    effect: {
      id: EffectId.GMAGIC3,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_10,
    klass: CardKlass.GAS,
    type: CardType.TRAP,
    name: "Gas card 10",
    manaCost: 10,
    effect: {
      id: EffectId.GTRAP1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_11,
    klass: CardKlass.GAS,
    type: CardType.TRAP,
    name: "Gas card 11",
    manaCost: 11,
    effect: {
      id: EffectId.GTRAP2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.GAS_12,
    klass: CardKlass.GAS,
    type: CardType.TRAP,
    name: "Gas card 12",
    manaCost: 12,
    effect: {
      id: EffectId.GTRAP3,
      type: EffectType.PASSIVE
    }
  }, { // ----- Plasma -----
    id: CardId.PLASMA_1,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 1",
    damage: 1,
    health: 1,
    manaCost: 1,
    effect: {
      id: EffectId.EXECUTE,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_2,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 2",
    damage: 2,
    health: 2,
    manaCost: 2,
    effect: {
      id: EffectId.PMINION2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_3,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 3",
    damage: 3,
    health: 3,
    manaCost: 3,
    effect: {
      id: EffectId.PMINION3,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_4,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 4",
    damage: 4,
    health: 4,
    manaCost: 4,
    effect: {
      id: EffectId.PMINION4,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_5,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 5",
    damage: 5,
    health: 5,
    manaCost: 5,
    effect: {
      id: EffectId.PMINION5,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_6,
    klass: CardKlass.PLASMA,
    type: CardType.MINION,
    name: "Plasma card 6",
    damage: 6,
    health: 6,
    manaCost: 6,
    effect: {
      id: EffectId.PMINION6,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_7,
    klass: CardKlass.PLASMA,
    type: CardType.MAGIC,
    name: "Plasma card 7",
    manaCost: 7,
    effect: {
      id: EffectId.PMAGIC1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_8,
    klass: CardKlass.PLASMA,
    type: CardType.MAGIC,
    name: "Plasma card 8",
    manaCost: 8,
    effect: {
      id: EffectId.PMAGIC2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_9,
    klass: CardKlass.PLASMA,
    type: CardType.MAGIC,
    name: "Plasma card 9",
    manaCost: 9,
    effect: {
      id: EffectId.PMAGIC3,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_10,
    klass: CardKlass.PLASMA,
    type: CardType.TRAP,
    name: "Plasma card 10",
    manaCost: 10,
    effect: {
      id: EffectId.PTRAP1,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_11,
    klass: CardKlass.PLASMA,
    type: CardType.TRAP,
    name: "Plasma card 11",
    manaCost: 11,
    effect: {
      id: EffectId.PTRAP2,
      type: EffectType.PASSIVE
    }
  }, {
    id: CardId.PLASMA_12,
    klass: CardKlass.PLASMA,
    type: CardType.TRAP,
    name: "Plasma card 12",
    manaCost: 12,
    effect: {
      id: EffectId.PTRAP3,
      type: EffectType.PASSIVE
    }
  }
];

export {cards};
