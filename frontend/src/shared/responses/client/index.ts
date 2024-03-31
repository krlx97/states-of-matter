import {acceptGame} from "./acceptGame";
import {claimRewards} from "./claimRewards";
import {closeLobby} from "./closeLobby";
import {createLobby} from "./createLobby";
import {declineGame} from "./declineGame";
import {finishTutorial} from "./finishTutorial";
import {gameEnded} from "./gameEnded";
import {gamePopup} from "./gamePopup";
import {joinLobbyReceiver} from "./joinLobbyReceiver";
import {joinLobbySender} from "./joinLobbySender";
import {joinQueue} from "./joinQueue";
import {leaveLobbyReceiver} from "./leaveLobbyReceiver";
import {leaveLobbySender} from "./leaveLobbySender";
import {leaveQueue} from "./leaveQueue";
import {saveDeck} from "./saveDeck";
import {selectDeck} from "./selectDeck";
import {selectSkin} from "./selectSkin";
import {startGame} from "./startGame";

const clientResponses = [
  acceptGame,
  claimRewards,
  closeLobby,
  createLobby,
  declineGame,
  finishTutorial,
  gameEnded,
  gamePopup,
  joinLobbyReceiver,
  joinLobbySender,
  joinQueue,
  leaveLobbyReceiver,
  leaveLobbySender,
  leaveQueue,
  saveDeck,
  selectDeck,
  selectSkin,
  startGame
];

export {clientResponses};
