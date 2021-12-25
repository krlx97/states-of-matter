import type {Request} from "../../../models";

const drawCard: Request = async (services) => {
  const {gameService, ioService, playerService} = services;
  const {socketId} = ioService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentUsername: string;

  if (player.username === game.playerA.username) {
    opponentUsername = game.playerB.username;

    const {playerA} = game;
    const {hand, deck} = playerA;
    const card = deck.pop();

    if (!card) { return; } // empty deck? game over?

    hand.push(card);

    await gameService.update({gameId}, {$set: {playerA}});
  } else {
    opponentUsername = game.playerA.username;

    const {playerB} = game;
    const {hand, deck} = playerB;
    const card = deck.pop();

    if (!card) { return; }

    hand.push(card);

    await gameService.update({gameId}, {$set: {playerB}});
  }

  ioService.emit("drawCardSender");

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  ioService.emitTo(opponent.socketId, "drawCardReceiver");
};

export default drawCard;
