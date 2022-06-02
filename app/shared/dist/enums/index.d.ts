declare enum CardKlass {
    NEUTRAL = 0,
    SOLID = 1,
    LIQUID = 2,
    GAS = 3,
    PLASMA = 4
}
declare enum CardType {
    HERO = 0,
    MINION = 1,
    MAGIC = 2,
    TRAP = 3
}
declare enum Effect {
    CHARGE = 0,
    QUICK_SHOT = 1,
    MULTI_STRIKE = 2,
    NECRO = 3,
    SPELLWEAVE = 4,
    PUPPETEER = 5,
    REBIRTH = 6,
    EXHAUST = 7,
    RELOAD = 8,
    MIRRORS_EDGE = 9,
    SMITE = 10,
    ANTI_MAGE = 11
}
declare enum PlayerStatus {
    OFFLINE = 0,
    ONLINE = 1,
    IN_CASUAL_QUEUE = 2,
    IN_RANKED_QUEUE = 3,
    INLOBBY = 4,
    INGAME = 5
}
export { CardKlass, CardType, Effect, PlayerStatus };
