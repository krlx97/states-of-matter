// Auth
import type {Signin} from "./auth/Signin.js";
// Client
import type {CreateLobby} from "./client/CreateLobby.js";
import type {DefaultSkin} from "./client/DefaultSkin.js";
import type {FinishTutorial} from "./client/FinishTutorial.js";
import type {GameEnded} from "./client/GameEnded.js";
import type {GetLeaderboards} from "./client/GetLeaderboards.js";
import type {JoinLobbyReceiver} from "./client/JoinLobbyReceiver.js";
import type {JoinLobbySender} from "./client/JoinLobbySender.js";
import type {JoinQueue} from "./client/JoinQueue.js";
import type {SelectDeck} from "./client/SelectDeck.js";
import type {SelectSkin} from "./client/SelectSkin.js";
import type {StartGame} from "./client/StartGame.js";
// Game
import type {AttackMinionSave} from "./game/AttackMinionSave.js";
import type {LevelUp} from "./game/LevelUp.js";
import type {ReloadGameState} from "./game/ReloadGameState.js";
// Sidenav
import type {AcceptFriendReceiver} from "./sidenav/AcceptFriendReceiver.js";
import type {AcceptFriendSender} from "./sidenav/AcceptFriendSender.js";
import type {AddFriend} from "./sidenav/AddFriend.js";
import type {BlockFriendReceiver} from "./sidenav/BlockFriendReceiver.js";
import type {BlockFriendSender} from "./sidenav/BlockFriendSender.js";
import type {DeclineFriend} from "./sidenav/DeclineFriend.js";
import type {RemoveFriendReceiver} from "./sidenav/RemoveFriendReceiver.js";
import type {RemoveFriendSender} from "./sidenav/RemoveFriendSender.js";
import type {SendChatMessageReceiver} from "./sidenav/SendChatMessageReceiver.js";
import type {SendChatMessageSender} from "./sidenav/SendChatMessageSender.js";
import type {SetAvatarReceiver} from "./sidenav/SetAvatarReceiver.js";
import type {SetAvatarSender} from "./sidenav/SetAvatarSender.js";
import type {UnblockFriend} from "./sidenav/UnblockFriend.js";
import type {UpdateFriend} from "./sidenav/UpdateFriend.js";

interface Responses {
  // Global
  notification: (params: string) => void;
  // Auth
  signin: (params: Signin) => void;
  // Client
  acceptGame: () => void;
  closeLobby: () => void;
  createLobby: (params: CreateLobby) => void;
  declineGame: () => void;
  defaultSkin: (params: DefaultSkin) => void;
  finishTutorial: (params: FinishTutorial) => void;
  gameEnded: (params: GameEnded) => void;
  gamePopup: () => void;
  getLeaderboards: (params: GetLeaderboards) => void;
  joinLobbyReceiver: (params: JoinLobbyReceiver) => void;
  joinLobbySender: (params: JoinLobbySender) => void;
  joinQueue: (params: JoinQueue) => void;
  leaveLobbyReceiver: () => void;
  leaveLobbySender: () => void;
  leaveQueue: () => void;
  selectDeck: (params: SelectDeck) => void;
  selectSkin: (params: SelectSkin) => void;
  startGame: (params: StartGame) => void;
  // Game
  attackMinionSave: (params: AttackMinionSave) => void;
  endGame: () => void;
  levelUp: (params: LevelUp) => void;
  reloadGameState: (params: ReloadGameState) => void;
  // Sidenav
  acceptFriendReceiver: (params: AcceptFriendReceiver) => void;
  acceptFriendSender: (params: AcceptFriendSender) => void;
  addFriend: (params: AddFriend) => void;
  blockFriendReceiver: (params: BlockFriendReceiver) => void;
  blockFriendSender: (params: BlockFriendSender) => void;
  declineFriend: (params: DeclineFriend) => void;
  removeFriendReceiver: (params: RemoveFriendReceiver) => void;
  removeFriendSender: (params: RemoveFriendSender) => void;
  sendChatMessageReceiver: (params: SendChatMessageReceiver) => void;
  sendChatMessageSender: (params: SendChatMessageSender) => void;
  setAvatarReceiver: (params: SetAvatarReceiver) => void;
  setAvatarSender: (params: SetAvatarSender) => void;
  unblockFriend: (params: UnblockFriend) => void;
  updateFriend: (params: UpdateFriend) => void;
}

export type {Responses};
