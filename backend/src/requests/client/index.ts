import {acceptGame} from "./acceptGame";
import {closeLobby} from "./closeLobby";
import {createLobby} from "./createLobby";
import {declineGame} from "./declineGame";
import {finishTutorial} from "./finishTutorial";
import {joinLobby} from "./joinLobby";
import {joinQueue} from "./joinQueue";
import {leaveLobby} from "./leaveLobby";
import {leaveQueue} from "./leaveQueue";
import {saveDeck} from "./saveDeck";
import {selectDeck} from "./selectDeck";
import {selectSkin} from "./selectSkin";
import {startCustomGame} from "./startCustomGame";

const client = [
  acceptGame,
  closeLobby,
  createLobby,
  declineGame,
  finishTutorial,
  joinLobby,
  joinQueue,
  leaveLobby,
  leaveQueue,
  saveDeck,
  selectDeck,
  selectSkin,
  startCustomGame
];

export {client};
