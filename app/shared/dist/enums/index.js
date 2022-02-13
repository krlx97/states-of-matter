var CardType;
(function (CardType) {
    CardType[CardType["MINION"] = 0] = "MINION";
    CardType[CardType["MAGIC"] = 1] = "MAGIC";
    CardType[CardType["TRAP"] = 2] = "TRAP";
})(CardType || (CardType = {}));
;
var CardKlass;
(function (CardKlass) {
    CardKlass[CardKlass["NEUTRAL"] = 0] = "NEUTRAL";
    CardKlass[CardKlass["SOLID"] = 1] = "SOLID";
    CardKlass[CardKlass["LIQUID"] = 2] = "LIQUID";
    CardKlass[CardKlass["GAS"] = 3] = "GAS";
    CardKlass[CardKlass["PLASMA"] = 4] = "PLASMA";
})(CardKlass || (CardKlass = {}));
;
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["OFFLINE"] = 0] = "OFFLINE";
    PlayerStatus[PlayerStatus["ONLINE"] = 1] = "ONLINE";
    PlayerStatus[PlayerStatus["INQUEUE"] = 2] = "INQUEUE";
    PlayerStatus[PlayerStatus["INLOBBY"] = 3] = "INLOBBY";
    PlayerStatus[PlayerStatus["INGAME"] = 4] = "INGAME";
})(PlayerStatus || (PlayerStatus = {}));
;
var SocketEvent;
(function (SocketEvent) {
    // ------------------------------ GLOBAL ------------------------------
    SocketEvent["NOTIFICATION"] = "notification";
    SocketEvent["SEND_CHAT_MSG"] = "sendChatMsg";
    SocketEvent["SEND_CHAT_MSG_RECEIVER"] = "sendChatMsgReceiver";
    SocketEvent["SEND_CHAT_MSG_SENDER"] = "sendChatMsgSender";
    SocketEvent["UPDATE_FRIEND"] = "updateFriend";
    // ------------------------------ AUTH ------------------------------
    SocketEvent["GET_PRIVATE_KEY_HASH"] = "getPrivateKeyHash";
    SocketEvent["SIGNIN"] = "signin";
    SocketEvent["SIGNUP"] = "signup";
    // ------------------------------ CLIENT ------------------------------
    SocketEvent["DESTROY_LOBBY"] = "destroyLobby";
    SocketEvent["JOIN_LOBBY"] = "joinLobby";
    SocketEvent["JOIN_LOBBY_RECEIVER"] = "joinLobbyReceiver";
    SocketEvent["JOIN_LOBBY_SENDER"] = "joinLobbySender";
    SocketEvent["LEAVE_LOBBY"] = "leaveLobby";
    SocketEvent["LEAVE_LOBBY_RECEIVER"] = "leaveLobbyReceiver";
    SocketEvent["LEAVE_LOBBY_SENDER"] = "leaveLobbySender";
    SocketEvent["MAKE_LOBBY"] = "makeLobby";
    SocketEvent["SAVE_DECK"] = "saveDeck";
    SocketEvent["SELECT_DECK"] = "selectDeck";
    SocketEvent["SET_DECK_KLASS"] = "setDeckKlass";
    SocketEvent["SET_DECK_NAME"] = "setDeckName";
    SocketEvent["START_GAME"] = "startGame";
    // ------------------------------ GAME ------------------------------
    SocketEvent["ATTACK_CARD"] = "attackCard";
    SocketEvent["ATTACK_CARD_RECEIVER"] = "attackCardReceiver";
    SocketEvent["ATTACK_CARD_SENDER"] = "attackCardSender";
    SocketEvent["END_TURN"] = "endTurn";
    SocketEvent["END_TURN_OPPONENT"] = "endTurnOpponent";
    SocketEvent["END_TURN_PLAYER"] = "endTurnPlayer";
    SocketEvent["HOVER_CARD"] = "hoverCard";
    SocketEvent["UNHOVER_CARD"] = "unhoverCard";
    SocketEvent["PLAY_CARD"] = "playCard";
    SocketEvent["PLAY_CARD_RECEIVER"] = "playCardReceiver";
    SocketEvent["PLAY_CARD_SENDER"] = "playCardSender";
    SocketEvent["END_GAME"] = "endGame";
    // ------------------------------ SIDENAV ------------------------------
    SocketEvent["ACCEPT_FRIEND"] = "acceptFriend";
    SocketEvent["ACCEPT_FRIEND_RECEIVER"] = "acceptFriendReceiver";
    SocketEvent["ACCEPT_FRIEND_SENDER"] = "acceptFriendSender";
    SocketEvent["ADD_FRIEND"] = "addFriend";
    SocketEvent["BLOCK_FRIEND"] = "block";
    SocketEvent["BLOCK_FRIEND_SENDER"] = "blockSender";
    SocketEvent["BLOCK_FRIEND_RECEIVER"] = "blockReceiver";
    SocketEvent["DECLINE_FRIEND"] = "declineFriend";
    SocketEvent["SET_AVATAR"] = "setAvatar";
    SocketEvent["SET_AVATAR_RECEIVER"] = "setAvatarReceiver";
    SocketEvent["SET_AVATAR_SENDER"] = "setAvatarSender";
    SocketEvent["SIGNOUT"] = "signout";
    SocketEvent["UNBLOCK_FRIEND"] = "unblock";
    SocketEvent["UNFRIEND"] = "unfriend";
    SocketEvent["UNFRIEND_RECEIVER"] = "unfriendReceiver";
    SocketEvent["UNFRIEND_SENDER"] = "unfriendSender";
})(SocketEvent || (SocketEvent = {}));
;
export { CardType, CardKlass, PlayerStatus, SocketEvent };
