interface LobbyPlayer {
  username: string;
  avatarId: number;
}

interface Lobby {
  _id?: string;
  lobbyId: number;
  host: LobbyPlayer;
  challengee: LobbyPlayer;
}

export type {LobbyPlayer, Lobby};
