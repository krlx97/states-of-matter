import {CardType, EffectId, LogType} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Animations} from "@som/shared/types/game";

const playMagic: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("playMagic", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    const {gid, field, target} = params;
    const {$game, player, opponent} = getGameData;

    // if (field && opponent.field[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
    //   return error("Selected card has Elusive buff.");
    // }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.MAGIC) {
      return error("Selected card is not Magic.");
    }

    if (card.manaCost.current > player.field.hero.mana.current) {
      return error("Not enough mana.");
    }

    player.field.hero.mana.current -= card.manaCost.current;
    player.hand.splice(player.hand.indexOf(card), 1);
    player.graveyard.push(card);

    animations.push({
      type: "MAGIC",
      name: player.name,
      card: card
    }, {
      type: "MANA_CAPACITY",
      field: "hero",
      name: player.name,
      increment: -card.manaCost.current
    });

    let logText = "";

    const {trap} = opponent;

    if (trap && trap.effect === EffectId.SILENCE) {
      animations.push(...effect.silence({opponent, trap}));
    } else {
      if (card.effect === EffectId.REBIRTH) {
        if (!target) {
          return error("Target for revival not specified.");
        }

        if (!field) {
          return error("Field for Special Summon not specified.");
        }

        if (field === "hero") {
          return error("Cannot Summon on this field.");
        }

        if (player.field[field]) {
          return error(`Minion already exists on the field ${field}.`);
        }

        const toRevive = player.graveyard.find((card) => card.gid === target);

        if (!toRevive) {
          return error("Card with the given ID not found in the graveyard.");
        }

        if (toRevive.type !== CardType.MINION) {
          return error("Selected card for revival must be a Minion.");
        }

        if (toRevive.effect === EffectId.ELUSIVE) {
          return error("Rebirth negated.");
        }

        animations.push(...effect.rebirth({player, playerMinion: toRevive, playerMinionField: field}));
      }

      if (card.effect === EffectId.DIMINISH) {
        if (!field) {
          return error("Field for Effect not specified.");
        }

        if (field === "hero") {
          return error("Cannot Summon on this field.");
        }

        const card = opponent.field[field];

        if (!card) {
          return error(`Minion doesn't exist on the field ${field}.`);
        }

        const elusive = card.buffs.find(
          (buff): boolean => buff.id === EffectId.ELUSIVE
        );

        if (elusive) {
          return error("Diminish negated.");
        }

        animations.push(...effect.diminish({
          opponent,
          opponentMinion: card,
          opponentMinionField: field
        }));
      }

      if (card.effect === EffectId.RELOAD) {
        const drawnCard = player.deck.pop();

        if (!drawnCard) {
          return error("You have no cards remaining to draw.");
        }

        effect.reload({player, drawnCard});
      }

      if (card.effect === EffectId.VALOR) {
        animations.push(...effect.valor({player, opponent}));

        if (await gameHelpers.isGameOver($game, animations)) {
          return;
        }
      }

      if (card.effect === EffectId.SHELL) {
        animations.push(...effect.shell({player}));
      }

      if (card.effect === EffectId.FORTITUDE) {
        if (!field) {
          return error("Field not specified.");
        }

        if (field === "hero") {
          return error("Hero not allowed.");
        }

        const playerMinion = player.field[field];

        if (!playerMinion) {
          return error(`No minion on the ${field} field.`);
        }

        const playerMinionField = field;

        animations.push(
          ...effect.fortitude({player, playerMinion, playerMinionField})
        );
      }



      // IN DEVELOPMENT!
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

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {playMagic};
