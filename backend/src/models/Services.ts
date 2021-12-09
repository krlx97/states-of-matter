import type {
  BlockchainService,
  ChatService,
  GameService,
  IoService,
  LobbyService,
  PlayerService,
} from "../services/index.js";

interface Services {
  blockchainService: BlockchainService;
  chatService: ChatService;
  gameService: GameService;
  ioService: IoService;
  lobbyService: LobbyService;
  playerService: PlayerService;
}

export type {Services};
