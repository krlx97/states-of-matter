import {acceptGame} from "./acceptGame";
import {addFriend} from "./addFriend";
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
import {removeFriend} from "./removeFriend";
import {saveDeck} from "./saveDeck";
import {selectDeck} from "./selectDeck";
import {selectSkin} from "./selectSkin";
import {sendChatMessage} from "./sendChatMessage";
import {setAvatar} from "./setAvatar";
import {setBanner} from "./setBanner";
import {startCustomGame} from "./startCustomGame";

const client = [
  acceptGame,
  addFriend,
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
  removeFriend,
  saveDeck,
  selectDeck,
  selectSkin,
  sendChatMessage,
  setAvatar,
  setBanner,
  startCustomGame
];

export {client};
