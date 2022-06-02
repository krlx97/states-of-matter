enum CardKlass {NEUTRAL, SOLID, LIQUID, GAS, PLASMA};
enum CardType {HERO, MINION, MAGIC, TRAP};
enum Effect {
  // Neutral Minion
  CHARGE,
  QUICK_SHOT,
  MULTI_STRIKE,
  NECRO,
  SPELLWEAVE,
  PUPPETEER,
  // Neutral Magic
  REBIRTH,
  EXHAUST,
  RELOAD,
  // Neutral Trap
  MIRRORS_EDGE,
  SMITE,
  ANTI_MAGE
};

enum PlayerStatus {
  OFFLINE,
  ONLINE,
  IN_CASUAL_QUEUE,
  IN_RANKED_QUEUE,
  INLOBBY,
  INGAME
};

export {CardKlass, CardType, Effect, PlayerStatus};
