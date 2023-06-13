interface LobbyFrontendPlayer {
    name: string;
    socketId: string;
    avatarId: number;
}
interface LobbyFrontend {
    lobbyId: number;
    host: LobbyFrontendPlayer;
    challengee: LobbyFrontendPlayer;
}
export type { LobbyFrontend, LobbyFrontendPlayer };
