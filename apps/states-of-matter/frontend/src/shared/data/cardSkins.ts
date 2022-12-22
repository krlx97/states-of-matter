import { CardId } from "@som/shared/enums";

const cardSkins = new Map<CardId, Array<{skinId: number, extension: string}>>([
  // ----- Neutral -----
  [CardId.SEAFARER, [{
    skinId: 1,
    extension: ".jpg"
  }]],
  [CardId.AVET, [{
    skinId: 1,
    extension: ".jpg"
  }]],
  [CardId.GUIDING_LIGHTS, [{
    skinId: 1,
    extension: ".gif"
  }]],
  [CardId.VESSELS, [{
    skinId: 1,
    extension: ".jpg"
  }]],
  [CardId.EARTHS_BELOVED, []],
  [CardId.PILGRIMS, []],
  [CardId.REBIRTH, []],
  [CardId.EXHAUST, []],
  [CardId.RELOAD, []],
  [CardId.MIRRORS_EDGE, []],
  [CardId.SMITE, []],
  [CardId.ANTI_MAGE, []],
  // ----- Solid -----
  [CardId.SOLID_1, []],
  [CardId.SOLID_2, []],
  [CardId.SOLID_3, []],
  [CardId.SOLID_4, []],
  [CardId.SOLID_5, []],
  [CardId.SOLID_6, []],
  [CardId.SOLID_7, []],
  [CardId.SOLID_8, []],
  [CardId.SOLID_9, []],
  [CardId.SOLID_10, []],
  [CardId.SOLID_11, []],
  [CardId.SOLID_12, []],
  // ----- Liquid -----
  [CardId.LIQUID_1, []],
  [CardId.LIQUID_2, []],
  [CardId.LIQUID_3, []],
  [CardId.LIQUID_4, []],
  [CardId.LIQUID_5, []],
  [CardId.LIQUID_6, []],
  [CardId.LIQUID_7, []],
  [CardId.LIQUID_8, []],
  [CardId.LIQUID_9, []],
  [CardId.LIQUID_10, []],
  [CardId.LIQUID_11, []],
  [CardId.LIQUID_12, []],
  // ----- Gas -----
  [CardId.GAS_1, []],
  [CardId.GAS_2, []],
  [CardId.GAS_3, []],
  [CardId.GAS_4, []],
  [CardId.GAS_5, []],
  [CardId.GAS_6, []],
  [CardId.GAS_7, []],
  [CardId.GAS_8, []],
  [CardId.GAS_9, []],
  [CardId.GAS_10, []],
  [CardId.GAS_11, []],
  [CardId.GAS_12, []],
  // ----- Plasma -----
  [CardId.PLASMA_1, []],
  [CardId.PLASMA_2, []],
  [CardId.PLASMA_3, []],
  [CardId.PLASMA_4, []],
  [CardId.PLASMA_5, []],
  [CardId.PLASMA_6, []],
  [CardId.PLASMA_7, []],
  [CardId.PLASMA_8, []],
  [CardId.PLASMA_9, []],
  [CardId.PLASMA_10, []],
  [CardId.PLASMA_11, []],
  [CardId.PLASMA_12, []],

  [CardId.SOLID_HERO, []],
  [CardId.LIQUID_HERO, []],
  [CardId.GAS_HERO, []],
  [CardId.PLASMA_HERO, []]
]);

export {cardSkins};
