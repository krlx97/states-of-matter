import {sendChatMsg, updateFriend} from "./global";
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

import {attackCard, endTurn, hoverCard, playCard, unhoverCard} from "./game";

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
  updateFriend,
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
  attackCard,
  endTurn,
  hoverCard,
  playCard,
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
