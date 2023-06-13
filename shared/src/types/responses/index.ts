import {GameType, PlayerStatus, QueueId} from "../../enums/index.js";
import type {AccountFrontend, LobbyView, LobbyPlayerView, PlayerView, GameView} from "../frontend/index.js";

// -------------------- AUTH --------------------
interface Signin {
  accountFrontend: AccountFrontend;
  playerFrontend: PlayerView;
  lobbyFrontend: LobbyView | undefined;
  gameFrontend: GameView | undefined;
}
// -------------------- CLIENT --------------------
interface CreateLobby {
  lobby: LobbyView;
}

interface DefaultSkin {
  cardId: number;
}

interface FinishTutorial {
  tutorial: "deckBuilder" | "wallet" | "play";
}

interface GameEnded {
  isWinner: boolean;
  gameType: GameType;
  experience: number;
  elo: number;
}


interface GetLeaderboards {
  byLevel: Array<{
    name: string;
    level: number;
    avatarId: number;
  }>;
  byElo: Array<{
    name: string;
    elo: number;
    avatarId: number;
  }>;
}

interface JoinLobbyReceiver {
  challengee: LobbyPlayerView;
}

interface JoinLobbySender {
  lobby: LobbyView;
}

interface JoinQueue {
  queueId: QueueId;
}

interface SelectDeck {
  deckId: number;
}

interface SelectSkin {
  cardId: number;
  skinId: number;
}

interface StartGamePlayer {
  name: string;
  avatarId: number;
  level: number;
  elo: number;
}
interface StartGame {
  playerA: StartGamePlayer;
  playerB: StartGamePlayer;
  game: GameView;
}
// -------------------- GAME --------------------
interface ReloadGameState {
  game: GameView;
}
// -------------------- SIDENAV --------------------
interface AcceptFriendReceiver {
  name: string;
  avatarId: number;
  status: PlayerStatus;
}

interface AcceptFriendSender {
  name: string;
  avatarId: number;
  status: PlayerStatus;
}

interface AddFriend {
  name: string;
}

interface BlockFriendReceiver {
  name: string;
}

interface BlockFriendSender {
  name: string;
}

interface DeclineFriend {
  name: string;
}

interface RemoveFriendReceiver {
  name: string;
}

interface RemoveFriendSender {
  name: string;
}

interface SendChatMsgReceiver {
  sender: string;
  text: string;
  date: Date;
}

interface SendChatMsgSender {
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}

interface SetAvatarReceiver {
  name: string;
  avatarId: number;
}

interface SetAvatarSender {
  avatarId: number;
}

interface UnblockFriend {
  name: string;
}

interface UpdateFriend {
  name: string;
  status: number;
}

// --------------------------------------------------


interface LevelUp {
  xp: number;
}

interface FloatingText {
  field: string;
  damage: number;
}

type Callback<Params = undefined> = (params?: Params) => void;

interface SocketResponses {
  // Global
  notification: Callback<string>;
  // Auth
  signin: Callback<Signin>;
  // Client
  acceptGame: Callback;
  closeLobby: Callback;
  createLobby: Callback<CreateLobby>;
  declineGame: Callback;
  defaultSkin: Callback<DefaultSkin>;
  finishTutorial: Callback<FinishTutorial>;
  gameEnded: Callback<GameEnded>;
  gamePopup: Callback;
  getLeaderboards: Callback<GetLeaderboards>;
  joinLobbyReceiver: Callback<JoinLobbyReceiver>;
  joinLobbySender: Callback<JoinLobbySender>;
  joinQueue: Callback<JoinQueue>;
  leaveLobbyReceiver: Callback;
  leaveLobbySender: Callback;
  leaveQueue: Callback;
  selectDeck: Callback<SelectDeck>;
  selectSkin: Callback<SelectSkin>;
  startGame: Callback<StartGame>;
  // Game
  endGame: () => void;
  floatingText: Callback<FloatingText>;
  levelUp: Callback<LevelUp>;
  reloadGameState: Callback<ReloadGameState>;
  // Sidenav
  acceptFriendReceiver: Callback<AcceptFriendReceiver>;
  acceptFriendSender: Callback<AcceptFriendSender>;
  addFriend: Callback<AddFriend>;
  blockFriendReceiver: Callback<BlockFriendReceiver>;
  blockFriendSender: Callback<BlockFriendSender>;
  declineFriend: Callback<DeclineFriend>;
  removeFriendReceiver: Callback<RemoveFriendReceiver>;
  removeFriendSender: Callback<RemoveFriendSender>;
  sendChatMsgReceiver: Callback<SendChatMsgReceiver>;
  sendChatMsgSender: Callback<SendChatMsgSender>;
  setAvatarReceiver: Callback<SetAvatarReceiver>;
  setAvatarSender: Callback<SetAvatarSender>;
  unblockFriend: Callback<UnblockFriend>;
  updateFriend: Callback<UpdateFriend>;
}

export type {SocketResponses};
