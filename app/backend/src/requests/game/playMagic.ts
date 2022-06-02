import {CardType, Effect} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";
import type {GameTrap} from "models/game";

const playMagic: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playMagic", async (params) => {
    const {gid} = params;
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== username) { return; }

    const {player} = gameEngine.getPlayers($game, username);
    const {hand, hero} = player;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    if (handCard.type !== CardType.MAGIC) { return; }
    if (handCard.manaCost > hero.mana) { return; }

    if (handCard.effects.includes(Effect.RELOAD)) {
      hero.mana -= handCard.manaCost;
      await gameEngine.drawCard($game, player);
      hand.splice(hand.indexOf(handCard), 1);
      player.graveyard.push(handCard);
    }

    await gameEngine.saveGame($game);
  });
};

export {playMagic};
