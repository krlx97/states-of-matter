import {disconnect, getPrivateKeyHash, signin, signup} from "./auth";

import {
  destroyLobby,
  joinLobby,
  leaveLobby,
  makeLobby,
  saveDeck,
  selectDeck,
  sendToken,
  setDeckKlass,
  setDeckName,
  startGame
} from "./client";

import {
  attackHero,
  attackMinion,
  endTurn,
  hoverCard,
  playMinion,
  unhoverCard
} from "./game";

import {sendChatMsg, updateStatus} from "./global";

import {
  acceptFriend,
  addFriend,
  block,
  declineFriend,
  setAvatar,
  signout,
  unblock,
  unfriend
} from "./sidenav";

export const requests = [
  sendChatMsg,
  updateStatus,

  disconnect,
  getPrivateKeyHash,
  signin,
  signup,

  destroyLobby,
  joinLobby,
  leaveLobby,
  makeLobby,
  saveDeck,
  selectDeck,
  sendToken,
  setDeckKlass,
  setDeckName,
  startGame,

  attackHero,
  attackMinion,
  endTurn,
  hoverCard,
  playMinion,
  unhoverCard,

  acceptFriend,
  addFriend,
  block,
  declineFriend,
  setAvatar,
  signout,
  unblock,
  unfriend
];
