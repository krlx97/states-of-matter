enum BuffId {
  BLAZE,
  NECROMANCY,
  ELUSIVE,
  REVENGE,
  DIMINISH,
  UNITY,
  SPELLWEAVE,
  UNBREAKABLE,
  RISING_FURY,
  REGENERATION,
  SACRIFICE,
  SHADOWSTRIKE,
  LEECH,
  RESILIENT,
  ACIDIC_DEATH,
  POISONOUS_TOUCH,
  CORROSIVE_TOUCH,
  CONTAMINATED_AIR,
  SELF_DESTRUCT,
  RAMPAGE,
  BACKSTAB,
  MARKSMANSHIP,
  OVERPOWER,
  EXECUTE,
  HYSTERIA
}

enum EffectId {
  // ========== COMMON / BUFFS ==========
  ETERNAL_AURA,
  TAUNT,
  SHIELD,
  LIFE_AURA,
  TOXIC_AURA,
  NEUROTOXIN,
  STEALTH,
  BURNING_AURA,
  OVERCHARGE,
  // ========== NEUTRAL ==========
  // ----- MINION -----
  SHADOW_SURGE,     // ⚡ On Normal Summon & Special Summon
  QUICK_SHOT,       // ⚡ On Normal Summon
  BLAZE,            // ♾️ On Normal Summon
  NECROMANCY,       // ♾️ On Normal Summon & Special Summon
  ELUSIVE,          // ♾️ On Normal Summon
  REVENGE,          // ♾️ On Self Death
  // ----- MAGIC -----
  REBIRTH,          // ⚡ On Normal Summon
  DIMINISH,         // ♾️ On Normal Summon
  RELOAD,           // ⚡ On Normal Summon
  // ----- TRAP -----
  MIRRORS_EDGE,     // ⚡ On Opponent Minion attack
  SMITE,            // ⚡ On Opponent Normal Summon
  SILENCE,          // ⚡ On Opponent Normal Summon
  // ========== SOLID ==========
  // ----- MINION -----
  GLORY,            // ⚡ On Normal Summon
  UNITY,            // ♾️ On Self Death
  SPELLWEAVE,       // ♾️ On Normal Summon
  SHIELDWALL,       // ⚡ On Normal Summon
  UNBREAKABLE,      // ♾️ On Normal Summon
  PROTECTOR,        // ⚡ On Normal Summon & Special Summon
  // ----- MAGIC -----
  VALOR,            // ⚡ On Normal Summon
  SHELL,            // ⚡ On Normal Summon
  FORTITUDE,        // ⚡ On Normal Summon
  // ----- TRAP -----
  RICOCHET,         // ⚡ On Attack
  LAST_STAND,       // ⚡ On Attack
  HEART_OF_STEEL,   // ⚡ On Attack
  // ========== LIQUID ==========
  // ----- MINION -----
  RISING_FURY,      // ♾️ On Ally Minion Death
  REGENERATION,     // ♾️ On End Turn
  SACRIFICE,        // ♾️ On Ally Minion Death
  SHADOWSTRIKE,     // ♾️ On Attack
  LEECH,            // ♾️ On Attack
  RESILIENT,        // ♾️ On Attack
  // ----- MAGIC -----
  ELECTRO_SHOCK,    // ⚡ On Normal Summon
  CLEANSE,          // ⚡ On Normal Summon
  TIDAL_WAVE,       // ⚡ On Normal Summon
  // ----- TRAP -----
  RETRIBUTION,      // ⚡ On Opponent Hero Attack
  FROSTBITE,        // ⚡ On Opponent Attack
  BANISH,           // ⚡ On Opponent Normal Summon
  // ========== GAS ==========
  // ----- MINION -----
  ACIDIC_DEATH,     // ♾️ On Self Death
  VANISH,           // ⚡ On Normal Summon
  POISONOUS_TOUCH,  // ♾️ On Attack
  TOXIC_SPRAY,      // ⚡ On Normal Summon
  CORROSIVE_TOUCH,  // ♾️ On Attack
  TOXIC_GAS,        // ⚡ On Normal Summon
  // ----- MAGIC -----
  ACID_RAIN,        // ⚡ On Normal Summon
  SMOKE_BOMB,       // ⚡ On Normal Summon
  CONTAMINATED_AIR, // ♾️ On Normal Summon
  // ----- TRAP -----
  RUSTY_NEEDLE,     // ⚡ On Opponent Attack
  NOXIOUS_FUMES,    // ⚡ On Opponent Attack
  POISONED_GROUND,  // ⚡ On Opponent Normal Summon
  // ========== PLASMA ==========
  // ----- MINION -----
  SELF_DESTRUCT,    // ♾️ On Self Death
  RAMPAGE,          // ♾️ On Attack
  BACKSTAB,         // ♾️ On Attack
  MARKSMANSHIP,     // ♾️ On Attack
  OVERPOWER,        // ♾️ On Attack
  EXECUTE,          // ♾️ On Attack
  // ----- MAGIC -----
  IGNITE,           // ⚡ On Normal Summon
  CORRUPTION,       // ⚡ On Normal Summon
  HYSTERIA,         // ♾️ On Normal Summon
  // ----- TRAP -----
  EXPLOSIVE,        // ⚡ On Opponent Attack
  REFLECTION,       // ⚡ On Ally Minion Death
  CONSTRICTION      // ⚡ On Opponent Attack
};

export {EffectId};
