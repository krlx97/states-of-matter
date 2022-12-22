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
export { PlayerStatus };
