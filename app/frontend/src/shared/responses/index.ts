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
  attackCardReceiver,
  attackCardSender,
  endGame,
  endTurnOpponent,
  endTurnPlayer,
  hoverCard,
  playCardReceiver,
  playCardSender,
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
  attackCardReceiver,
  attackCardSender,
  endGame,
  endTurnOpponent,
  endTurnPlayer,
  hoverCard,
  playCardReceiver,
  playCardSender,
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
