export var CardType;
(function (CardType) {
    CardType[CardType["HERO"] = 0] = "HERO";
    CardType[CardType["MINION"] = 1] = "MINION";
    CardType[CardType["MAGIC"] = 2] = "MAGIC";
    CardType[CardType["TRAP"] = 3] = "TRAP";
})(CardType || (CardType = {}));
;
export var CardKlass;
(function (CardKlass) {
    CardKlass[CardKlass["NEUTRAL"] = 0] = "NEUTRAL";
    CardKlass[CardKlass["SOLID"] = 1] = "SOLID";
    CardKlass[CardKlass["LIQUID"] = 2] = "LIQUID";
    CardKlass[CardKlass["GAS"] = 3] = "GAS";
    CardKlass[CardKlass["PLASMA"] = 4] = "PLASMA";
})(CardKlass || (CardKlass = {}));
;
export var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["OFFLINE"] = 0] = "OFFLINE";
    PlayerStatus[PlayerStatus["ONLINE"] = 1] = "ONLINE";
    PlayerStatus[PlayerStatus["INQUEUE"] = 2] = "INQUEUE";
    PlayerStatus[PlayerStatus["INLOBBY"] = 3] = "INLOBBY";
    PlayerStatus[PlayerStatus["INGAME"] = 4] = "INGAME";
})(PlayerStatus || (PlayerStatus = {}));
;
export var Effect;
(function (Effect) {
    Effect[Effect["GREED"] = 0] = "GREED";
    Effect[Effect["BLIND"] = 1] = "BLIND";
    Effect[Effect["CHARGE"] = 2] = "CHARGE";
})(Effect || (Effect = {}));
;
