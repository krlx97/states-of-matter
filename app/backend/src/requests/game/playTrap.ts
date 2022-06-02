import {CardType} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";
import type {GameTrap} from "models/game";

const playTrap: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playTrap", async (params) => {
    const {gid} = params;
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== username) { return; }

    const {player} = gameEngine.getPlayers($game, username);

    if (player.trap) { return; }

    const {hand, hero} = player;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    
    if (handCard.type !== CardType.TRAP) { return; }
    console.log("playtrap");
    if (handCard.manaCost > hero.mana) { return; }

console.log(handCard);
    hero.mana -= handCard.manaCost;
    player.trap = handCard as GameTrap;
    hand.splice(hand.indexOf(handCard), 1);

    await gameEngine.saveGame($game);
  });
};

export {playTrap};
