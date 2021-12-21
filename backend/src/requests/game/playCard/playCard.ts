import type {Request} from "../../../models";
import type {PlayCard} from "./playCard.models";

const playCard: Request<PlayCard> = async (services, params) => {
  const {gameService, ioService, playerService} = services;
  const {field, gid, id} = params;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  const game = await gameService.find({gameId: player.gameId});

  if (!game) { return; }

  let opponentUsername: string;

  if (player.username === game.playerA.username) {
    opponentUsername = game.playerB.username;

    const {playerA} = game;
    const {hand} = playerA;
    const card = hand.find((card) => card.gid === gid);

    if (!card) { return; }
    if (playerA.fields[field].gid) { return; }

    const i = hand.indexOf(card);

    hand.splice(i, 1);
    playerA.fields[field] = {gid, id};

    await gameService.update({gameId: player.gameId}, {$set: {playerA}});
  } else {
    opponentUsername = game.playerA.username;

    const {playerB} = game;
    const {hand} = playerB;
    const card = hand.find((card) => card.gid === gid);

    if (!card) { return; }
    if (playerB.fields[field].gid) { return; }

    const i = hand.indexOf(card);

    hand.splice(i, 1);
    playerB.fields[field] = {gid, id};

    await gameService.update({gameId: player.gameId}, {$set: {playerB}});
  }

  ioService.emit("playCardSender", params);

  const opponent = await playerService.find({username: opponentUsername});

  if (!opponent) { return; }

  ioService.emitTo(opponent.socketId, "playCardReceiver", params);
};

export default playCard;
