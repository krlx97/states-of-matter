import MongoService from "../MongoService.js";
import type {Player} from "./PlayerService.models";

class PlayerService extends MongoService<Player> {}

export default PlayerService;
