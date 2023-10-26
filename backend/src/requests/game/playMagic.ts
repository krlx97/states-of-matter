import {CardType, EffectId, LogType} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const playMagic: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("playMagic", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {gid, field, target} = params;
    const {$game, player, opponent} = getGameData;

    if (field && opponent.field[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
      return error("Selected card has Elusive buff.");
    }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.MAGIC) {
      return error("Selected card is not Magic.");
    }

    if (card.manaCost > player.field.hero.mana) {
      return error("Not enough mana.");
    }

    player.field.hero.mana -= card.manaCost;
    player.hand.splice(player.hand.indexOf(card), 1);
    player.graveyard.push(card);

    let logText = "";

    const {trap} = opponent;

    if (trap && trap.effect === EffectId.SILENCE) {
      effect.silence({opponent, trap});
    } else {
      if (card.effect === EffectId.REBIRTH) {
        const [success, message] = effect.rebirth({player, target, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.DIMINISH) {
        const [success, message] = effect.diminish({opponent, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.RELOAD) {
        effect.reload({player});
      }

      if (card.effect === EffectId.VALOR) {
        const [success, message] = effect.valor({opponent});
        if (!success) {
          return error(message);
        } else {
          if (await gameHelpers.isGameOver($game)) { return; }
          logText = message;
        }
      }

      if (card.effect === EffectId.SHELL) {
        const [success, message] = effect.shell({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.FORTITUDE) {
        const [success, message] = effect.fortitude({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.ELECTRO_SHOCK) {
        const [success, message] = effect.electroShock({player, opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CLEANSE) {
        const [success, message] = effect.cleanse({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.TIDAL_WAVE) {
        const [success, message] = effect.tidalWave({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.ACID_RAIN) {
        const [success, message] = effect.acidRain({opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.SMOKE_BOMB) {
        const [success, message] = effect.smokeBomb({player});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CONTAMINATED_AIR) {
        const [success, message] = effect.contaminatedAir({player, opponent});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.IGNITE) {
        const [success, message] = effect.ignite({player, opponent, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.CORRUPTION) {
        const [success, message] = effect.corruption({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }

      if (card.effect === EffectId.HYSTERIA) {
        const [success, message] = effect.hysteria({player, field});
        if (!success) {
          return error(message);
        } else {
          logText = message;
        }
      }
    }

    $game.gameLogs.push({
      type: LogType.MAGIC,
      player: player.name,
      magicId: card.id
    });

    await gameHelpers.saveGame($game);
  });
};

export {playMagic};
