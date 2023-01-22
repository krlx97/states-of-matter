import {EffectId} from "@som/shared/enums";

const cardEffects = new Map<EffectId, string>([
  // ----- Neutral -----
  [EffectId.CHARGE,       "Can attack on the same turn when summoned."],
  [EffectId.QUICK_SHOT,   "When Normal Summoned deal 2 Damage to a random enemy Minion."],
  [EffectId.MULTI_STRIKE, "Can attack twice per turn."],
  [EffectId.NECRO,        "Normal summon -2 ATK, -2 HP, Special summon +5 ATK, +5 HP."],
  [EffectId.SPELLWEAVE,   "Gain +1 ATK for every spell and trap card in your graveyard."],
  [EffectId.PUPPETEER,    "When Normal Summoned, Special Summon a Token Minion based on Hero Class."],
  [EffectId.REBIRTH,      "Special summon 1 Minion from the graveyard."],
  [EffectId.EXHAUST,      "Reduce ATK and HP of one enemy Minion by 5."],
  [EffectId.RELOAD,       "Draw one card."],
  [EffectId.MIRRORS_EDGE, "Reflect next incoming attack back to the enemy Hero."],
  [EffectId.SMITE,        "Destroy the enemies next Minion Card."],
  [EffectId.ANTI_MAGE,    "Destroy the enemies next Magic card."],
  // ----- Solid -----
  [EffectId.S_HERO,     "All Solid Minions gain x2 Fortify from <ABILITY>"],
  [EffectId.SMITH,      "Give all allied Solid minions +1 FORTIFY"],
  [EffectId.INITIATIVE, "If this unit has taunt, it gains x2 Fortify from effect"],
  [EffectId.MITIGATE,   "Transfer this Minions Fortify to your other attacked Minion"],
  [EffectId.SHIELDWALL, "Spawn with -3 HP, gain +1 Fortify for every allied Minion on the field"],
  [EffectId.BREAK,      "Lose 2 Fortify, give an allied Minion Taunt"],
  [EffectId.BOND,       "If a copy of this card is present on the Field, double both of their Fortify"],
  [EffectId.SSPELL1,    "For each taunt effect on the board, give your Hero +1 Fortify"],
  [EffectId.SSPELL2,    "Give a Minion +3 Fortify"],
  [EffectId.SSPELL3,    "Give a Minion Taunt"],
  [EffectId.REDIRECT,   "Redirect next incoming attack to random Minion"],
  [EffectId.BULWARK,     "Convert your next attacked Minions Damage to Fortify."],
  [EffectId.STRAP3,     "Your Minions gain fortify equal to enemys summoned Minion HP, divided equally."],
  // ----- Liquid -----
  [EffectId.L_HERO,           "All Liquid Minions gain x2 Heal from <ABILITY>"],
  [EffectId.HEAL,             "When <NAME> is normal summoned HEAL an allied Minion for +2 HP."],
  [EffectId.RADIATING_HEAL,   "When this unit takes damage HEAL all allied units for +1 HP."],
  [EffectId.IMBUE,            "Random Minion card on your field gains +1 HP whenever you play a Magic card."],
  [EffectId.SACRIFICE,        "Destroy self and HEAL all ally Minions for +2 HP."],
  [EffectId.VIVIFY,           "Toggle to HEAL an ally Minion for +1 HP, <NAME> cannot attack."],
  [EffectId.CLEANSE,          "Toggle to CLEANSE - either enemy Minion buffs, or ally Minion debuffs."],
  [EffectId.SWAP,             "Target either ally or enemy Minion and swap its ATK and HP."],
  [EffectId.LINK,             "Target two minions, they now have shared HP pool."],
  [EffectId.CONTROL,          "Take control of an enemy minion."],
  [EffectId.CLEANSING_WATERS, "Remove all debuffs on both allied and the board."],
  [EffectId.LTRAP2,           "Liquid card 11 effect coming soon."],
  [EffectId.LTRAP3,           "Liquid card 12 effect coming soon."],
  // ----- Gas -----
  [EffectId.G_HERO, "Gas hero effect coming soon."],
  [EffectId.GMINION1, "Gas card 1 effect coming soon."],
  [EffectId.GMINION2, "Gas card 2 effect coming soon."],
  [EffectId.GMINION3, "Gas card 3 effect coming soon."],
  [EffectId.GMINION4, "Gas card 4 effect coming soon."],
  [EffectId.GMINION5, "Gas card 5 effect coming soon."],
  [EffectId.GMINION6, "Gas card 6 effect coming soon."],
  [EffectId.GMAGIC1,  "Gas card 7 effect coming soon."],
  [EffectId.GMAGIC2,  "Gas card 8 effect coming soon."],
  [EffectId.GMAGIC3,  "Gas card 9 effect coming soon."],
  [EffectId.GTRAP1,   "Gas card 10 effect coming soon."],
  [EffectId.GTRAP2,   "Gas card 11 effect coming soon."],
  [EffectId.GTRAP3,   "Gas card 12 effect coming soon."],
  // ----- Plasma -----
  [EffectId.P_HERO,  "Plasma hero effect comming soon."],
  [EffectId.EXECUTE,  "Executes Minions below 1 HP after combat."],
  [EffectId.PMINION2, "Plasma card 2 effect coming soon."],
  [EffectId.PMINION3, "Plasma card 3 effect coming soon."],
  [EffectId.PMINION4, "Plasma card 4 effect coming soon."],
  [EffectId.PMINION5, "Plasma card 5 effect coming soon."],
  [EffectId.PMINION6, "Plasma card 6 effect coming soon."],
  [EffectId.PMAGIC1,  "Plasma card 7 effect coming soon."],
  [EffectId.PMAGIC2,  "Plasma card 8 effect coming soon."],
  [EffectId.PMAGIC3,  "Plasma card 9 effect coming soon."],
  [EffectId.PTRAP1,   "Ally Minion that's being attacked gains +3 ATK."],
  [EffectId.PTRAP2,   "Plasma card 11 effect coming soon."],
  [EffectId.PTRAP3,   "Plasma card 12 effect coming soon."]
]);

export {cardEffects};