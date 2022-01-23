import MongoService from "../MongoService.js";
import type {Game} from "./GameService.models";

class GameService extends MongoService<Game> {}

export default GameService;
