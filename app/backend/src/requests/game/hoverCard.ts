import {HoverCardReq} from "@som/shared/interfaces/requests";
import {SocketRequest} from "models";

const hoverCard: SocketRequest<HoverCardReq> = async (services, params) => {
  const {gameService, playerService, socketService} = services;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentName: string;

  if (game.playerA.username === player.username) {
    opponentName = game.playerB.username;
  } else {
    opponentName = game.playerA.username;
  }

  const opponent = await playerService.find({
    username: opponentName
  });

  if (!opponent || !opponent.socketId) { return; }

  socketService.emit(opponent.socketId).hoverCard(params);
};

export default hoverCard;
