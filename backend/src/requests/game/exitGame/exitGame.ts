import type {Request} from "../../../models";
import type {ExitGame} from "./exitGame.models";

const exitGame: Request<ExitGame> = async (services, params) => {
  const {gameService, ioService, playerService} = services;
  const {gameId} = params;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  if (!player.gameId) {
    ioService.notification("You are not in a game.");
    return;
  }

  const game = await gameService.find({gameId});

  if (!game) { return; }

  const isDeleted = await gameService.delete({gameId});

  if (!isDeleted) { return; }

  ioService.emit("exitGameSender");

  const {username} = game.playerB;
  const challengee = await playerService.find({username});

  if (!challengee || !challengee.socketId) { return; }

  ioService.emitTo(challengee.socketId, "exitGameReceiver");
};

export default exitGame;
