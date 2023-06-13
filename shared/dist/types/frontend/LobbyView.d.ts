interface LobbyPlayerView {
    name: string;
    avatarId: number;
}
interface LobbyView {
    id: number;
    host: LobbyPlayerView;
    challengee: LobbyPlayerView;
}
export type { LobbyView, LobbyPlayerView };
