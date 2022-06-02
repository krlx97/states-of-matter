import {getPrivateKeyHash, signin} from "./auth";

import {
  destroyLobby,
  joinCasualQueue,
  joinLobbyReceiver,
  joinLobbySender,
  joinRankedQueue,
  leaveCasualQueue,
  leaveLobbyReceiver,
  leaveLobbySender,
  leaveRankedQueue,
  makeLobby,
  saveDeck,
  selectDeck,
  setDeckKlass,
  setDeckName,
  startGame
} from "./client";

import {
  endGame,
  hoverCard,
  hoverHandCard,
  levelUp,
  reloadGameState,
  unhoverCard,
  unhoverHandCard
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
  joinCasualQueue,
  joinLobbyReceiver,
  joinLobbySender,
  joinRankedQueue,
  leaveCasualQueue,
  leaveLobbyReceiver,
  leaveLobbySender,
  leaveRankedQueue,
  makeLobby,
  saveDeck,
  selectDeck,
  setDeckKlass,
  setDeckName,
  startGame,
  // Game
  endGame,
  hoverCard,
  hoverHandCard,
  levelUp,
  reloadGameState,
  unhoverCard,
  unhoverHandCard,
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
