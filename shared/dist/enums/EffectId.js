var EffectId;
(function (EffectId) {
    // ========== COMMON / BUFFS ==========
    EffectId[EffectId["ETERNAL_AURA"] = 0] = "ETERNAL_AURA";
    EffectId[EffectId["TAUNT"] = 1] = "TAUNT";
    EffectId[EffectId["SHIELD"] = 2] = "SHIELD";
    EffectId[EffectId["LIFE_AURA"] = 3] = "LIFE_AURA";
    EffectId[EffectId["TOXIC_AURA"] = 4] = "TOXIC_AURA";
    EffectId[EffectId["NEUROTOXIN"] = 5] = "NEUROTOXIN";
    EffectId[EffectId["STEALTH"] = 6] = "STEALTH";
    EffectId[EffectId["BURNING_AURA"] = 7] = "BURNING_AURA";
    EffectId[EffectId["OVERCHARGE"] = 8] = "OVERCHARGE";
    // ========== NEUTRAL ==========
    // ----- MINION -----
    EffectId[EffectId["SHADOW_SURGE"] = 9] = "SHADOW_SURGE";
    EffectId[EffectId["QUICK_SHOT"] = 10] = "QUICK_SHOT";
    EffectId[EffectId["BLAZE"] = 11] = "BLAZE";
    EffectId[EffectId["NECROMANCY"] = 12] = "NECROMANCY";
    EffectId[EffectId["ELUSIVE"] = 13] = "ELUSIVE";
    EffectId[EffectId["REVENGE"] = 14] = "REVENGE";
    // ----- MAGIC -----
    EffectId[EffectId["REBIRTH"] = 15] = "REBIRTH";
    EffectId[EffectId["DIMINISH"] = 16] = "DIMINISH";
    EffectId[EffectId["RELOAD"] = 17] = "RELOAD";
    // ----- TRAP -----
    EffectId[EffectId["MIRRORS_EDGE"] = 18] = "MIRRORS_EDGE";
    EffectId[EffectId["SMITE"] = 19] = "SMITE";
    EffectId[EffectId["SILENCE"] = 20] = "SILENCE";
    // ========== SOLID ==========
    // ----- MINION -----
    EffectId[EffectId["GLORY"] = 21] = "GLORY";
    EffectId[EffectId["UNITY"] = 22] = "UNITY";
    EffectId[EffectId["SPELLWEAVE"] = 23] = "SPELLWEAVE";
    EffectId[EffectId["SHIELDWALL"] = 24] = "SHIELDWALL";
    EffectId[EffectId["UNBREAKABLE"] = 25] = "UNBREAKABLE";
    EffectId[EffectId["PROTECTOR"] = 26] = "PROTECTOR";
    // ----- MAGIC -----
    EffectId[EffectId["VALOR"] = 27] = "VALOR";
    EffectId[EffectId["SHELL"] = 28] = "SHELL";
    EffectId[EffectId["FORTITUDE"] = 29] = "FORTITUDE";
    // ----- TRAP -----
    EffectId[EffectId["RICOCHET"] = 30] = "RICOCHET";
    EffectId[EffectId["LAST_STAND"] = 31] = "LAST_STAND";
    EffectId[EffectId["HEART_OF_STEEL"] = 32] = "HEART_OF_STEEL";
    // ========== LIQUID ==========
    // ----- MINION -----
    EffectId[EffectId["RISING_FURY"] = 33] = "RISING_FURY";
    EffectId[EffectId["REGENERATION"] = 34] = "REGENERATION";
    EffectId[EffectId["SACRIFICE"] = 35] = "SACRIFICE";
    EffectId[EffectId["SHADOWSTRIKE"] = 36] = "SHADOWSTRIKE";
    EffectId[EffectId["LEECH"] = 37] = "LEECH";
    EffectId[EffectId["RESILIENT"] = 38] = "RESILIENT";
    // ----- MAGIC -----
    EffectId[EffectId["ELECTRO_SHOCK"] = 39] = "ELECTRO_SHOCK";
    EffectId[EffectId["CLEANSE"] = 40] = "CLEANSE";
    EffectId[EffectId["TIDAL_WAVE"] = 41] = "TIDAL_WAVE";
    // ----- TRAP -----
    EffectId[EffectId["RETRIBUTION"] = 42] = "RETRIBUTION";
    EffectId[EffectId["FROSTBITE"] = 43] = "FROSTBITE";
    EffectId[EffectId["BANISH"] = 44] = "BANISH";
    // ========== GAS ==========
    // ----- MINION -----
    EffectId[EffectId["ACIDIC_DEATH"] = 45] = "ACIDIC_DEATH";
    EffectId[EffectId["VANISH"] = 46] = "VANISH";
    EffectId[EffectId["POISONOUS_TOUCH"] = 47] = "POISONOUS_TOUCH";
    EffectId[EffectId["TOXIC_SPRAY"] = 48] = "TOXIC_SPRAY";
    EffectId[EffectId["CORROSIVE_TOUCH"] = 49] = "CORROSIVE_TOUCH";
    EffectId[EffectId["TOXIC_GAS"] = 50] = "TOXIC_GAS";
    // ----- MAGIC -----
    EffectId[EffectId["ACID_RAIN"] = 51] = "ACID_RAIN";
    EffectId[EffectId["SMOKE_BOMB"] = 52] = "SMOKE_BOMB";
    EffectId[EffectId["CONTAMINATED_AIR"] = 53] = "CONTAMINATED_AIR";
    // ----- TRAP -----
    EffectId[EffectId["RUSTY_NEEDLE"] = 54] = "RUSTY_NEEDLE";
    EffectId[EffectId["NOXIOUS_FUMES"] = 55] = "NOXIOUS_FUMES";
    EffectId[EffectId["POISONED_GROUND"] = 56] = "POISONED_GROUND";
    // ========== PLASMA ==========
    // ----- MINION -----
    EffectId[EffectId["SELF_DESTRUCT"] = 57] = "SELF_DESTRUCT";
    EffectId[EffectId["RAMPAGE"] = 58] = "RAMPAGE";
    EffectId[EffectId["BACKSTAB"] = 59] = "BACKSTAB";
    EffectId[EffectId["MARKSMANSHIP"] = 60] = "MARKSMANSHIP";
    EffectId[EffectId["OVERPOWER"] = 61] = "OVERPOWER";
    EffectId[EffectId["EXECUTE"] = 62] = "EXECUTE";
    // ----- MAGIC -----
    EffectId[EffectId["IGNITE"] = 63] = "IGNITE";
    EffectId[EffectId["CORRUPTION"] = 64] = "CORRUPTION";
    EffectId[EffectId["HYSTERIA"] = 65] = "HYSTERIA";
    // ----- TRAP -----
    EffectId[EffectId["EXPLOSIVE"] = 66] = "EXPLOSIVE";
    EffectId[EffectId["REFLECTION"] = 67] = "REFLECTION";
    EffectId[EffectId["CONSTRICTION"] = 68] = "CONSTRICTION"; // ⚡ On Opponent Attack
})(EffectId || (EffectId = {}));
;
export { EffectId };
