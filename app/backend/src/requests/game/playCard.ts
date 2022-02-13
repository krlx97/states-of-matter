import type {PlayCardReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";
import type {GamePlayerCard} from "../../services/GameService/GameService.models"

const playCard: SocketRequest<PlayCardReq> = async (services, params) => {
  const {gameService, playerService, socketService} = services;
  const {field, gid, id} = params;
  const {socketId} = socketService;
  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {gameId} = player;
  const game = await gameService.find({gameId});

  if (!game) { return; }

  let opponentUsername = "";
  let card: GamePlayerCard;

  if (player.username === game.playerA.username) {
    opponentUsername = game.playerB.username;

    const {playerA} = game;
    const {hand, fields, hero} = playerA;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    if (fields[field]) { return; }
    if (!handCard.manaCost || handCard.manaCost > hero.mana) { return; }

    hero.mana -= handCard.manaCost;
    fields[field] = handCard;
    hand.splice(hand.indexOf(handCard), 1);
    card = handCard;

    await gameService.update({gameId}, {$set: {playerA}});
  } else {
    opponentUsername = game.playerA.username;

    const {playerB} = game;
    const {hand, fields, hero} = playerB;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    if (fields[field]) { return; }
    if (!handCard.manaCost || handCard.manaCost > hero.mana) { return; }

    hero.mana -= handCard.manaCost;
    fields[field] = handCard;
    hand.splice(hand.indexOf(handCard), 1);
    card = handCard;

    await gameService.update({gameId}, {$set: {playerB}});
  }

  socketService.emit().playCardSender({field, gid});

  const opponent = await playerService.find({
    username: opponentUsername
  });

  if (!opponent || !opponent.socketId) { return; }

  socketService.emit(opponent.socketId).playCardReceiver({field, card});
};

export default playCard;