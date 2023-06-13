import {CardType, EffectId, LogType} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const playMagic: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playMagic", async (params) => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {gid, field, target} = params;
    const {$game, player, opponent} = getGameData;

    if (field && opponent.minion[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
      return error("Selected minion has Elusive buff.");
    }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.MAGIC) {
      return error("Selected card is not Magic.");
    }

    if (card.manaCost > player.hero.mana) {
      return error("Not enough mana.");
    }

    player.hero.mana -= card.manaCost;
    player.hand.splice(player.hand.indexOf(card), 1);
    player.graveyard.push(card);

    let logText = "";

    const {trap} = opponent;

    if (trap && trap.effect === EffectId.SILENCE) {
      triggerEffect.silence({opponent, trap});
    } else {
      if (card.effect === EffectId.REBIRTH) {
        const [success, message] = triggerEffect.rebirth({player, target, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.DIMINISH) {
        const [success, message] = triggerEffect.diminish({opponent, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.RELOAD) {
        triggerEffect.reload({player});
      }

      if (card.effect === EffectId.VALOR) {
        const [success, message] = triggerEffect.valor({opponent});
        if (!success) {
          return error(message);
        } else {
          if (await gameEngine.isGameOver($game)) { return; }
          logText = message;
        }
      }

      if (card.effect === EffectId.SHELL) {
        const [success, message] = triggerEffect.shell({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.FORTITUDE) {
        const [success, message] = triggerEffect.fortitude({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.ELECTRO_SHOCK) {
        const [success, message] = triggerEffect.electroShock({player, opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CLEANSE) {
        const [success, message] = triggerEffect.cleanse({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.TIDAL_WAVE) {
        const [success, message] = triggerEffect.tidalWave({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.ACID_RAIN) {
        const [success, message] = triggerEffect.acidRain({opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.SMOKE_BOMB) {
        const [success, message] = triggerEffect.smokeBomb({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CONTAMINATED_AIR) {
        const [success, message] = triggerEffect.contaminatedAir({player, opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.IGNITE) {
        const [success, message] = triggerEffect.ignite({player, opponent, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CORRUPTION) {
        const [success, message] = triggerEffect.corruption({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.HYSTERIA) {
        const [success, message] = triggerEffect.hysteria({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }
    }

    await gameEngine.animateMagicTrigger($game, player.name, card);

    $game.gameLogs.push({
      type: LogType.MAGIC,
      player: player.name,
      magicId: card.id
    });

    await gameEngine.saveGame($game);
  });
};

export {playMagic};
