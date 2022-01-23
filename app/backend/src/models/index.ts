import type {Api} from "eosjs";
import type {Db} from "mongodb";
import type {Server, Socket} from "socket.io";

import type {
  BlockchainService,
  ChatService,
  GameService,
  LobbyService,
  PlayerService,
  SocketService
} from "services";

import type {
  GetPrivateKeyHashReq,
  SigninReq,
  SignupReq,
  JoinLobbyReq,
  SaveDeckReq,
  SelectDeckReq,
  SetDeckKlassReq,
  SetDeckNameReq,
  StartGameReq,
  AttackCardReq,
  PlayCardReq,
  AcceptFriendReq,
  AddFriendReq,
  BlockReq,
  DeclineFriendReq,
  SetAvatarReq,
  UnblockReq,
  UnfriendReq,
  SendChatMsgReq
} from "@som/shared/interfaces/requests";

interface Apis {
  eos: Api;
  io: Server;
  mongo: Db;
  socket: Socket;
}

interface Services {
  blockchainService: BlockchainService;
  chatService: ChatService;
  gameService: GameService;
  socketService: SocketService;
  lobbyService: LobbyService;
  playerService: PlayerService;
}

type SocketRequest<T = {}> = (services: Services, params: T) => Promise<void>;

type SocketRequestParams =
  GetPrivateKeyHashReq &
  SigninReq &
  SignupReq &
  JoinLobbyReq &
  SaveDeckReq &
  SelectDeckReq &
  SetDeckKlassReq &
  SetDeckNameReq &
  StartGameReq &
  AttackCardReq &
  PlayCardReq &
  AcceptFriendReq &
  AddFriendReq &
  BlockReq &
  DeclineFriendReq &
  SetAvatarReq &
  UnblockReq &
  UnfriendReq &
  SendChatMsgReq;

export type {Apis, Services, SocketRequest, SocketRequestParams};
