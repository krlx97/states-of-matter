var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["OFFLINE"] = 0] = "OFFLINE";
    PlayerStatus[PlayerStatus["ONLINE"] = 1] = "ONLINE";
    PlayerStatus[PlayerStatus["IN_QUEUE"] = 2] = "IN_QUEUE";
    PlayerStatus[PlayerStatus["IN_LOBBY"] = 3] = "IN_LOBBY";
    PlayerStatus[PlayerStatus["IN_GAME"] = 4] = "IN_GAME";
})(PlayerStatus || (PlayerStatus = {}));
;
export { PlayerStatus };
