import { EffectId } from "@som/shared/enums";

const cardEffectNames = new Map<EffectId, string>([
  [EffectId.CHARGE, "Charge"],
  [EffectId.QUICK_SHOT, "Quick Shot"],
  [EffectId.MULTI_STRIKE, "Multi Strike"],
  [EffectId.NECRO, "Necromancy"],
  [EffectId.SPELLWEAVE, "Spellweave"],
  [EffectId.PUPPETEER, "Puppeteer"],
  [EffectId.REBIRTH, "Rebirth"],
  [EffectId.EXHAUST, "Exhaust"],
  [EffectId.RELOAD, "Reload"],
  [EffectId.MIRRORS_EDGE, "Mirrors Edge"],
  [EffectId.SMITE, "Smite"],
  [EffectId.ANTI_MAGE, "Anti Mage"],

  [EffectId.S_HERO, "SH Effect"],
  [EffectId.SMITH, "Smith"],
  [EffectId.INITIATIVE, "Initiative"],
  [EffectId.MITIGATE, "Mitigate"],
  [EffectId.SHIELDWALL, "Shieldwall"],
  [EffectId.BREAK, "Break"],
  [EffectId.BOND, "Bond"],
  [EffectId.SSPELL1, "SM 1 Effect"],
  [EffectId.SSPELL2, "SM 2 Effect"],
  [EffectId.SSPELL3, "SM 3 Effect"],
  [EffectId.REDIRECT, "ST 1 Effect"],
  [EffectId.BULWARK, "ST 2 Effect"],
  [EffectId.STRAP3, "ST 3 Effect"]
]);

export {cardEffectNames};
