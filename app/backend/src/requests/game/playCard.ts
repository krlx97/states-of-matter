import type {SocketRequest} from "models";
import type {GamePlayerCard} from "../../services/MongoService/GameService.models"

export const playCard: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("playCard", async (params) => {
    const {field, gid, id} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    let opponentUsername = "";
    let card: GamePlayerCard;

    if ($player.username === $game.playerA.username) {
      opponentUsername = $game.playerB.username;

      const {playerA} = $game;
      const {hand, fields, hero} = playerA;
      const handCard = hand.find((card) => card.gid === gid);

      if (!handCard) { return; }
      if (fields[field]) { return; }
      if (!handCard.manaCost || handCard.manaCost > hero.mana) { return; }

      hero.mana -= handCard.manaCost;
      fields[field] = handCard;
      hand.splice(hand.indexOf(handCard), 1);
      card = handCard;

      await $games.updateOne({gameId}, {$set: {playerA}});
    } else {
      opponentUsername = $game.playerA.username;

      const {playerB} = $game;
      const {hand, fields, hero} = playerB;
      const handCard = hand.find((card) => card.gid === gid);

      if (!handCard) { return; }
      if (fields[field]) { return; }
      if (!handCard.manaCost || handCard.manaCost > hero.mana) { return; }

      hero.mana -= handCard.manaCost;
      fields[field] = handCard;
      hand.splice(hand.indexOf(handCard), 1);
      card = handCard;

      await $games.updateOne({gameId}, {$set: {playerB}});
    }

    socket.emit("playCardPlayer", {field, gid});

    const opponent = await $players.findOne({
      username: opponentUsername
    });

    if (!opponent || !opponent.socketId) { return; }

    io.to(opponent.socketId).emit("playCardOpponent", {field, card});
  });
};
