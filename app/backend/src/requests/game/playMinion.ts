import {CardType, Effect} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";
import type {GameMinion} from "models/game";

const playMinion: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playMinion", async (params) => {
    const {field, gid} = params;
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const game = await gamesDb.findOne({gameId});

    if (!game) { return; }
    if (game.currentPlayer !== username) { return; }

    const {player, opponent} = gameEngine.getPlayers(game, username);
    const {hand, minion, hero, graveyard} = player;
    const handCard = hand.find((card) => card.gid === gid);

    if (!handCard) { return; }
    if (handCard.type !== CardType.MINION) { return; }
    if (minion[field]) { return; }
    if (handCard.manaCost > hero.mana) { return; }

    hero.mana -= handCard.manaCost;
    minion[field] = handCard as GameMinion;
    hand.splice(hand.indexOf(handCard), 1);

    const summonedMinion = minion[field];

    if (!summonedMinion) { return; }

    if (opponent.trap && opponent.trap.effects.includes(Effect.SMITE)) {
      summonedMinion.health = summonedMinion.maxHealth;

      graveyard.push(summonedMinion);
      minion[field] = undefined;

      opponent.graveyard.push(opponent.trap);
      opponent.trap = undefined;
    }

    triggerEffect.charge(summonedMinion);
    triggerEffect.quickShot(summonedMinion, opponent);
    triggerEffect.necro(summonedMinion);
    triggerEffect.spellweave(summonedMinion, player);

    await gameEngine.saveGame(game);
  });
};

export {playMinion};
