import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const playMinion: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playMinion", async (params) => {
    const {field, gid} = params;
    const data = await gameEngine.getGame(socketId);

    if (!data) { return; }

    const {$game, player, opponent} = data;

    if ($game.currentPlayer !== player.username) { return; }

    const summonedMinion = gameEngine.playMinion(player, gid, field);

    if (!summonedMinion) { return; }

    const isSmiteTriggered = triggerEffect.smite(player, opponent, summonedMinion, field);

    if (!isSmiteTriggered) {
      triggerEffect.charge(summonedMinion);
      triggerEffect.quickShot(summonedMinion, opponent);
      triggerEffect.necro(summonedMinion);
      triggerEffect.spellweave(summonedMinion, player);
    }

    await gameEngine.saveGame($game);
  });
};

export {playMinion};
