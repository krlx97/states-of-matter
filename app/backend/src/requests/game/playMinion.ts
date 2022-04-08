import {CardType} from "@som/shared/enums";
import type {App} from "models";

export const playMinion = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("playMinion", async (params) => {
    const {field, gid} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {player, opponent} = gameController.getPlayers($game, username);
    const {hand, minion, hero} = player;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    if (handCard.type !== CardType.MINION) { return; }
    if (minion[field]) { return; }
    if (!handCard.manaCost || handCard.manaCost > hero.mana) { return; }

    hero.mana -= handCard.manaCost;
    minion[field] = handCard;
    hand.splice(hand.indexOf(handCard), 1);

    const savedGame = await gameController.saveGame($game);

    if (!savedGame) { return; }

    socket.emit("playMinion|player", {field, gid});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("playMinion|opponent", {field, card: handCard});
  });
};
