import {getPrivateKeyHash, signin} from "./auth";

import {
  destroyLobby,
  joinLobbyReceiver,
  joinLobbySender,
  leaveLobbyReceiver,
  leaveLobbySender,
  makeLobby,
  saveDeck,
  selectDeck,
  setDeckKlass,
  setDeckName,
  startGame
} from "./client";

import {
  attackMinionOpponent,
  attackMinionPlayer,
  endGame,
  endTurnOpponent,
  endTurnPlayer,
  hoverCard,
  levelUp,
  playMinionOpponent,
  playMinionPlayer,
  reloadGameState,
  unhoverCard
} from "./game";

import {notification, sendChatMsgReceiver, sendChatMsgSender} from "./global";

import {
  acceptFriendReceiver,
  acceptFriendSender,
  addFriend,
  blockReceiver,
  blockSender,
  setAvatarReceiver,
  setAvatarSender,
  declineFriend,
  unblock,
  unfriendReceiver,
  unfriendSender,
  updateFriend
} from "./sidenav";

export const responses = [
  // Auth
  getPrivateKeyHash,
  signin,
  // Client
  destroyLobby,
  joinLobbyReceiver,
  joinLobbySender,
  leaveLobbyReceiver,
  leaveLobbySender,
  makeLobby,
  saveDeck,
  selectDeck,
  setDeckKlass,
  setDeckName,
  startGame,
  // Game
  attackMinionOpponent,
  attackMinionPlayer,
  endGame,
  endTurnOpponent,
  endTurnPlayer,
  hoverCard,
  levelUp,
  playMinionOpponent,
  playMinionPlayer,
  reloadGameState,
  unhoverCard,
  // Global
  notification,
  sendChatMsgReceiver,
  sendChatMsgSender,
  // Sidenav
  acceptFriendReceiver,
  acceptFriendSender,
  addFriend,
  blockReceiver,
  blockSender,
  setAvatarReceiver,
  setAvatarSender,
  declineFriend,
  unblock,
  unfriendReceiver,
  unfriendSender,
  updateFriend
];
