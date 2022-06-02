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
import {sendToken} from "./sendToken";
import {setDeckKlass} from "./setDeckKlass";
import {setDeckName} from "./setDeckName";
import {startCustomGame} from "./startCustomGame";

const client = [
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
  sendToken,
  setDeckKlass,
  setDeckName,
  startCustomGame
];

export {client};
