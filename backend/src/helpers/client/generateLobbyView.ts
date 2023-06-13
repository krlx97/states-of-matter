import type {WithId} from "mongodb";
import type {LobbyView} from "@som/shared/types/frontend";
import type {Lobby} from "@som/shared/types/backend";

const generateLobbyView = ($lobby: WithId<Lobby>): LobbyView => {
  const {id, host, challengee} = $lobby;
  return {id, host, challengee};
};

export {generateLobbyView};
