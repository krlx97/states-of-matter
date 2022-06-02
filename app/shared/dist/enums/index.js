var CardKlass;
(function (CardKlass) {
    CardKlass[CardKlass["NEUTRAL"] = 0] = "NEUTRAL";
    CardKlass[CardKlass["SOLID"] = 1] = "SOLID";
    CardKlass[CardKlass["LIQUID"] = 2] = "LIQUID";
    CardKlass[CardKlass["GAS"] = 3] = "GAS";
    CardKlass[CardKlass["PLASMA"] = 4] = "PLASMA";
})(CardKlass || (CardKlass = {}));
;
var CardType;
(function (CardType) {
    CardType[CardType["HERO"] = 0] = "HERO";
    CardType[CardType["MINION"] = 1] = "MINION";
    CardType[CardType["MAGIC"] = 2] = "MAGIC";
    CardType[CardType["TRAP"] = 3] = "TRAP";
})(CardType || (CardType = {}));
;
var Effect;
(function (Effect) {
    // Neutral Minion
    Effect[Effect["CHARGE"] = 0] = "CHARGE";
    Effect[Effect["QUICK_SHOT"] = 1] = "QUICK_SHOT";
    Effect[Effect["MULTI_STRIKE"] = 2] = "MULTI_STRIKE";
    Effect[Effect["NECRO"] = 3] = "NECRO";
    Effect[Effect["SPELLWEAVE"] = 4] = "SPELLWEAVE";
    Effect[Effect["PUPPETEER"] = 5] = "PUPPETEER";
    // Neutral Magic
    Effect[Effect["REBIRTH"] = 6] = "REBIRTH";
    Effect[Effect["EXHAUST"] = 7] = "EXHAUST";
    Effect[Effect["RELOAD"] = 8] = "RELOAD";
    // Neutral Trap
    Effect[Effect["MIRRORS_EDGE"] = 9] = "MIRRORS_EDGE";
    Effect[Effect["SMITE"] = 10] = "SMITE";
    Effect[Effect["ANTI_MAGE"] = 11] = "ANTI_MAGE";
})(Effect || (Effect = {}));
;
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["OFFLINE"] = 0] = "OFFLINE";
    PlayerStatus[PlayerStatus["ONLINE"] = 1] = "ONLINE";
    PlayerStatus[PlayerStatus["IN_CASUAL_QUEUE"] = 2] = "IN_CASUAL_QUEUE";
    PlayerStatus[PlayerStatus["IN_RANKED_QUEUE"] = 3] = "IN_RANKED_QUEUE";
    PlayerStatus[PlayerStatus["INLOBBY"] = 4] = "INLOBBY";
    PlayerStatus[PlayerStatus["INGAME"] = 5] = "INGAME";
})(PlayerStatus || (PlayerStatus = {}));
;
export { CardKlass, CardType, Effect, PlayerStatus };
