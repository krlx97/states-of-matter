enum CardType {MINION, MAGIC, TRAP};
enum CardKlass {NEUTRAL, SOLID, LIQUID, GAS, PLASMA};
enum PlayerStatus {OFFLINE, ONLINE, INQUEUE, INLOBBY, INGAME};

enum SocketEvent {
  // ------------------------------ GLOBAL ------------------------------
  NOTIFICATION = "notification",
  SEND_CHAT_MSG = "sendChatMsg",
  SEND_CHAT_MSG_RECEIVER = "sendChatMsgReceiver",
  SEND_CHAT_MSG_SENDER = "sendChatMsgSender",
  UPDATE_FRIEND = "updateFriend",
  // ------------------------------ AUTH ------------------------------
  GET_PRIVATE_KEY_HASH = "getPrivateKeyHash",
  SIGNIN = "signin",
  SIGNUP = "signup",
  // ------------------------------ CLIENT ------------------------------
  DESTROY_LOBBY = "destroyLobby",
  JOIN_LOBBY = "joinLobby",
  JOIN_LOBBY_RECEIVER = "joinLobbyReceiver",
  JOIN_LOBBY_SENDER = "joinLobbySender",
  LEAVE_LOBBY = "leaveLobby",
  LEAVE_LOBBY_RECEIVER = "leaveLobbyReceiver",
  LEAVE_LOBBY_SENDER = "leaveLobbySender",
  MAKE_LOBBY = "makeLobby",
  SAVE_DECK = "saveDeck",
  SELECT_DECK = "selectDeck",
  SET_DECK_KLASS = "setDeckKlass",
  SET_DECK_NAME = "setDeckName",
  START_GAME = "startGame",
  // ------------------------------ GAME ------------------------------
  ATTACK_CARD = "attackCard",
  ATTACK_CARD_RECEIVER = "attackCardReceiver",
  ATTACK_CARD_SENDER = "attackCardSender",
  END_TURN = "endTurn",
  END_TURN_OPPONENT = "endTurnOpponent",
  END_TURN_PLAYER = "endTurnPlayer",
  PLAY_CARD = "playCard",
  PLAY_CARD_RECEIVER = "playCardReceiver",
  PLAY_CARD_SENDER = "playCardSender",
  END_GAME = "endGame",
  // ------------------------------ SIDENAV ------------------------------
  ACCEPT_FRIEND = "acceptFriend",
  ACCEPT_FRIEND_RECEIVER = "acceptFriendReceiver",
  ACCEPT_FRIEND_SENDER = "acceptFriendSender",
  ADD_FRIEND = "addFriend",
  BLOCK_FRIEND = "block",
  BLOCK_FRIEND_SENDER = "blockSender",
  BLOCK_FRIEND_RECEIVER = "blockReceiver",
  DECLINE_FRIEND = "declineFriend",
  SET_AVATAR = "setAvatar",
  SET_AVATAR_RECEIVER = "setAvatarReceiver",
  SET_AVATAR_SENDER = "setAvatarSender",
  SIGNOUT = "signout",
  UNBLOCK_FRIEND = "unblock",
  UNFRIEND = "unfriend",
  UNFRIEND_RECEIVER = "unfriendReceiver",
  UNFRIEND_SENDER = "unfriendSender"
};

export {CardType, CardKlass, PlayerStatus, SocketEvent};
