import {acceptGame} from "./acceptGame";
import {claimRewards} from "./claimRewards";
import {closeLobby} from "./closeLobby";
import {createLobby} from "./createLobby";
import {declineGame} from "./declineGame";
import {finishTutorial} from "./finishTutorial";
import {getAddress} from "./getAddress";
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
  claimRewards,
  closeLobby,
  createLobby,
  declineGame,
  finishTutorial,
  getAddress,
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
