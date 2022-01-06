// Global
import sendChatMsg from "./sendChatMsg.js";
// Auth
import disconnect from "./auth/disconnect/disconnect.js";
import getPrivateKeyHash from "./auth/getPrivateKeyHash/getPrivateKeyHash.js";
import signin from "./auth/signin/signin.js";
import signup from "./auth/signup/signup.js";
// Client
import destroyLobby from "./client/destroyLobby/destroyLobby.js";
import joinLobby from "./client/joinLobby/joinLobby.js";
import leaveLobby from "./client/leaveLobby/leaveLobby.js";
import makeLobby from "./client/makeLobby/makeLobby.js";
import saveDeck from "./client/saveDeck/saveDeck.js";
import selectDeck from "./client/selectDeck/selectDeck.js";
import setDeckKlass from "./client/setDeckKlass/setDeckKlass.js";
import setDeckName from "./client/setDeckName/setDeckName.js";
import startGame from "./client/startGame/startGame.js";
// Game
import attackCard from "./game/attackCard/attackCard.js";
import drawCard from "./game/drawCard/drawCard.js";
import endTurn from "./game/endTurn/endTurn.js";
import exitGame from "./game/exitGame/exitGame.js";
import playCard from "./game/playCard/playCard.js";
// Sidenav
import acceptFriend from "./sidenav/acceptFriend/acceptFriend.js";
import addFriend from "./sidenav/addFriend/addFriend.js";
import block from "./sidenav/block/block.js";
import declineFriend from "./sidenav/declineFriend/declineFriend.js";
import setAvatar from "./sidenav/setAvatar/setAvatar.js";
import signout from "./sidenav/signout/signout.js";
import unblock from "./sidenav/unblock/unblock.js";
import unfriend from "./sidenav/unfriend/unfriend.js";
import updateFriend from "./sidenav/updateFriend/updateFriend.js";

const events = {
  // Global
  sendChatMsg,
  // Auth
  disconnect,
  getPrivateKeyHash,
  signin,
  signup,
  // Client
  destroyLobby,
  joinLobby,
  leaveLobby,
  makeLobby,
  saveDeck,
  selectDeck,
  setDeckKlass,
  setDeckName,
  startGame,
  // Game
  attackCard,
  drawCard,
  endTurn,
  exitGame,
  playCard,
  // Sidenav
  acceptFriend,
  addFriend,
  block,
  declineFriend,
  setAvatar,
  signout,
  unblock,
  unfriend,
  updateFriend
};

export default events;
