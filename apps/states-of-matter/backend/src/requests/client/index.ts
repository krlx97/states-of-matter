import {acceptGame} from "./acceptGame";
import {deselectSkin} from "./deselectSkin";
import {destroyLobby} from "./destroyLobby";
import {getLeaderboardsByLevel} from "./getLeaderboardsByLevel";
import {joinCasualQueue} from "./joinCasualQueue";
import {joinLobby} from "./joinLobby";
import {joinRankedQueue} from "./joinRankedQueue";
import {leaveCasualQueue} from "./leaveCasualQueue";
import {leaveLobby} from "./leaveLobby";
import {leaveRankedQueue} from "./leaveRankedQueue";
import {makeLobby} from "./makeLobby";
import {saveDeck} from "./saveDeck";
import {selectDeck} from "./selectDeck";
import {selectSkin} from "./selectSkin";
import {sendToken} from "./sendToken";
import {setDeckKlass} from "./setDeckKlass";
import {setDeckName} from "./setDeckName";
import {startCustomGame} from "./startCustomGame";

const client = [
  acceptGame,
  deselectSkin,
  destroyLobby,
  getLeaderboardsByLevel,
  joinCasualQueue,
  joinLobby,
  joinRankedQueue,
  leaveCasualQueue,
  leaveLobby,
  leaveRankedQueue,
  makeLobby,
  saveDeck,
  selectDeck,
  selectSkin,
  sendToken,
  setDeckKlass,
  setDeckName,
  startCustomGame
];

export {client};
