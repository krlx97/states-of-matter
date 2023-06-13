import {acceptGame} from "./acceptGame";
import {closeLobby} from "./closeLobby";
import {createLobby} from "./createLobby";
import {declineGame} from "./declineGame";
import {defaultSkin} from "./defaultSkin";
import {finishTutorial} from "./finishTutorial";
import {gameEnded} from "./gameEnded";
import {gamePopup} from "./gamePopup";
import {getLeaderboards} from "./getLeaderboards";
import {joinLobbyReceiver} from "./joinLobbyReceiver";
import {joinLobbySender} from "./joinLobbySender";
import {joinQueue} from "./joinQueue";
import {leaveLobbyReceiver} from "./leaveLobbyReceiver";
import {leaveLobbySender} from "./leaveLobbySender";
import {leaveQueue} from "./leaveQueue";
import {selectDeck} from "./selectDeck";
import {selectSkin} from "./selectSkin";
import {startGame} from "./startGame";

const clientResponses = [
  acceptGame,
  closeLobby,
  createLobby,
  declineGame,
  defaultSkin,
  finishTutorial,
  gameEnded,
  gamePopup,
  getLeaderboards,
  joinLobbyReceiver,
  joinLobbySender,
  joinQueue,
  leaveLobbyReceiver,
  leaveLobbySender,
  leaveQueue,
  selectDeck,
  selectSkin,
  startGame
];

export {clientResponses};
