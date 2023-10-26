// Auth
import type {Signin} from "./auth/Signin.js";
import type {Signup} from "./auth/Signup.js";
// Client
import type {DefaultSkin} from "./client/DefaultSkin.js";
import type {FinishTutorial} from "./client/FinishTutorial.js";
import type {JoinLobby} from "./client/JoinLobby.js";
import type {JoinQueue} from "./client/JoinQueue.js";
import type {SaveDeck} from "./client/SaveDeck.js";
import type {SelectDeck} from "./client/SelectDeck.js";
import type {SelectSkin} from "./client/SelectSkin.js";
// Game
import type {AttackHero} from "./game/AttackHero.js";
import type {AttackMinion} from "./game/AttackMinion.js";
import type {Attack} from "./game/Attack.js";
import type {PlayMagic} from "./game/PlayMagic.js";
import type {PlayMinion} from "./game/PlayMinion.js";
import type {PlayTrap} from "./game/PlayTrap.js";
// Sidenav
import type {AcceptFriend} from "./sidenav/AcceptFriend.js";
import type {AddFriend} from "./sidenav/AddFriend.js";
import type {BlockFriend} from "./sidenav/BlockFriend.js";
import type {DeclineFriend} from "./sidenav/DeclineFriend.js";
import type {RemoveFriend} from "./sidenav/RemoveFriend.js";
import type {SendChatMessage} from "./sidenav/SendChatMessage.js";
import type {SetAvatar} from "./sidenav/SetAvatar.js";
import type {UnblockFriend} from "./sidenav/UnblockFriend.js";

interface Requests {
  // Auth
  signin: (params: Signin) => Promise<void>;
  signup: (params: Signup) => Promise<void>;
  // Client
  acceptGame: () => Promise<void>;
  closeLobby: () => Promise<void>;
  createLobby: () => Promise<void>;
  declineGame: () => Promise<void>;
  defaultSkin: (params: DefaultSkin) => Promise<void>;
  finishTutorial: (params: FinishTutorial) => Promise<void>;
  getLeaderboards: () => Promise<void>;
  joinLobby: (params: JoinLobby) => Promise<void>;
  joinQueue: (params: JoinQueue) => Promise<void>;
  leaveLobby: () => Promise<void>;
  leaveQueue: () => Promise<void>;
  saveDeck: (params: SaveDeck) => Promise<void>;
  selectDeck: (params: SelectDeck) => Promise<void>;
  selectSkin: (params: SelectSkin) => Promise<void>;
  startCustomGame: () => Promise<void>;
  // Game
  attack: (params: Attack) => Promise<void>;
  attackHero: (params: AttackHero) => Promise<void>;
  attackMinion: (params: AttackMinion) => Promise<void>;
  endTurn: () => Promise<void>;
  playMagic: (params: PlayMagic) => Promise<void>;
  playMinion: (params: PlayMinion) => Promise<void>;
  playTrap: (params: PlayTrap) => Promise<void>;
  // Social
  acceptFriend: (params: AcceptFriend) => Promise<void>;
  addFriend: (params: AddFriend) => Promise<void>;
  blockFriend: (params: BlockFriend) => Promise<void>;
  declineFriend: (params: DeclineFriend) => Promise<void>;
  removeFriend: (params: RemoveFriend) => Promise<void>;
  sendChatMessage: (params: SendChatMessage) => Promise<void>;
  setAvatar: (params: SetAvatar) => Promise<void>;
  unblockFriend: (params: UnblockFriend) => Promise<void>;
  updateFriend: () => Promise<void>;
}

export type {Requests};
