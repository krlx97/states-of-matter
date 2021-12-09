import MongoService from "../MongoService.js";
import type {Lobby} from "./LobbyService.models";

class LobbyService extends MongoService<Lobby> {}

export default LobbyService;
