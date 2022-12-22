import {getPrivateKeyHash, signin} from "./auth";

import {
  deselectSkin,
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
  gamePopup,
  saveDeck,
  selectDeck,
  selectSkin,
  setDeckKlass,
  setDeckName,
  startGame,
  acceptGame
} from "./client";

import {
  endGame,
  floatingText,
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
  airdrop,
  blockReceiver,
  blockSender,
  setAvatarReceiver,
  setAvatarSender,
  stakeToken,
  transferTokenReceiver,
  transferTokenSender,
  declineFriend,
  mint,
  unblock,
  unfriendReceiver,
  unfriendSender,
  updateFriend,
  unstakeToken
} from "./sidenav";

export const responses = [
  // Auth
  getPrivateKeyHash,
  signin,
  // Client
  acceptGame,
  deselectSkin,
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
  gamePopup,
  saveDeck,
  selectDeck,
  selectSkin,
  setDeckKlass,
  setDeckName,
  startGame,
  // Game
  endGame,
  floatingText,
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
  airdrop,
  blockReceiver,
  blockSender,
  setAvatarReceiver,
  setAvatarSender,
  stakeToken,
  transferTokenReceiver,
  transferTokenSender,
  declineFriend,
  mint,
  unblock,
  unfriendReceiver,
  unfriendSender,
  unstakeToken,
  updateFriend
];
