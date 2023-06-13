import {CardType, EffectId, LogType} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const playMinion: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("playMinion", async (params) => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;
    const {field, gid} = params;

    if (player.minion[field]) {
      return error("Field already inhibits a Minion.");
    }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.MINION) {
      return error("Selected card is not Minion.");
    }

    if (card.manaCost > player.hero.mana) {
      return error("Not enough mana.");
    }

    player.hero.mana -= card.manaCost;
    player.minion[field] = card;

    const minion = player.minion[field];

    if (!minion) {
      return error("Error summoning card.");
    }

    player.hand.splice(player.hand.indexOf(card), 1);

    const {trap} = opponent;
    const isElusive = minion.effect === EffectId.ELUSIVE;

    // Step 1: Insert buffs / debuffs
    // Step 2: Check for on summon trap cards
    // Step 3: Trigger on summon effects

    switch (minion.effect) {
      case EffectId.BLAZE:
        const hasAttackedTwice = true;
        gameEngine.insertBuff(minion, EffectId.BLAZE, {hasAttackedTwice});
        break;
    }

    if (trap && !isElusive) {
      switch (trap.effect) {
        case EffectId.SMITE:
          triggerEffect.smite({player, opponent, minion, trap, field});
          break;
        case EffectId.BANISH:
          triggerEffect.banish({player, opponent, minion, trap, field});
          break;
        case EffectId.POISONED_GROUND:
          triggerEffect.poisonedGround({player: opponent, minion, trap});
          break;
      }
    } else {
      switch (minion.effect) {
        // ---------- [ N E U T R A L ] ----------
        case EffectId.SHADOW_SURGE:
          triggerEffect.shadowSurge({minion});
          break;
        case EffectId.QUICK_SHOT:
          triggerEffect.quickShot({opponent});
          break;
        case EffectId.NECROMANCY:
          gameEngine.insertDebuff(minion, EffectId.NECROMANCY, {
            health: -2,
            damage: -2
          });

          const isPositive = false;

          triggerEffect.necromancy({minion, isPositive});

          break;
        case EffectId.ELUSIVE:
          gameEngine.insertBuff(minion, EffectId.ELUSIVE);
          break;
        case EffectId.REVENGE:
          gameEngine.insertBuff(minion, EffectId.REVENGE);
          break;
        // ---------- [ S O L I D ] ----------
        case EffectId.GLORY:
          triggerEffect.glory({opponent, minion});
          break;
        case EffectId.UNITY:
          gameEngine.insertBuff(minion, EffectId.UNITY);
          break;
        case EffectId.SPELLWEAVE:
          triggerEffect.spellweave({player, minion});
          break;
        case EffectId.SHIELDWALL:
          triggerEffect.shieldwall({player, field});
          break;
        case EffectId.UNBREAKABLE:
          gameEngine.insertBuff(minion, EffectId.UNBREAKABLE);
          break;
        case EffectId.PROTECTOR:
          gameEngine.insertBuff(minion, EffectId.TAUNT);
          break;
        // ---------- [ L I Q U I D ] ----------
        case EffectId.RISING_FURY:
          gameEngine.insertBuff(minion, EffectId.RISING_FURY);
          break;
        case EffectId.REGENERATION:
          gameEngine.insertBuff(minion, EffectId.REGENERATION);
          break;
        case EffectId.SACRIFICE:
          gameEngine.insertBuff(minion, EffectId.SACRIFICE);
          break;
        case EffectId.SHADOWSTRIKE:
          gameEngine.insertBuff(minion, EffectId.SHADOWSTRIKE);
          break;
        case EffectId.LEECH:
          gameEngine.insertBuff(minion, EffectId.LEECH);
          break;
        case EffectId.RESILIENT:
          gameEngine.insertBuff(minion, EffectId.RESILIENT);
          break;
        // ---------- [ G A S ] ----------
        case EffectId.ACIDIC_DEATH:
          gameEngine.insertBuff(minion, EffectId.ACIDIC_DEATH);
          break;
        case EffectId.STEALTH:
          gameEngine.insertBuff(minion, EffectId.STEALTH);
          break;
        case EffectId.POISONOUS_TOUCH:
          gameEngine.insertBuff(minion, EffectId.POISONOUS_TOUCH);
          break;
        case EffectId.TOXIC_SPRAY:
          triggerEffect.toxicSpray({opponent});
          break;
        case EffectId.CORROSIVE_TOUCH:
          gameEngine.insertBuff(minion, EffectId.CORROSIVE_TOUCH);
          break;
        case EffectId.TOXIC_GAS:
          triggerEffect.toxicGas({opponent});
          break;
        // ---------- [ P L A S M A ] ----------
        case EffectId.SELF_DESTRUCT:
          gameEngine.insertBuff(minion, EffectId.SELF_DESTRUCT);
          break;
        case EffectId.RAMPAGE:
          gameEngine.insertBuff(minion, EffectId.RAMPAGE);
          break;
        case EffectId.BACKSTAB:
          gameEngine.insertBuff(minion, EffectId.BACKSTAB);
          break;
        case EffectId.MARKSMANSHIP:
          gameEngine.insertBuff(minion, EffectId.MARKSMANSHIP);
          break;
        case EffectId.OVERPOWER:
          gameEngine.insertBuff(minion, EffectId.OVERPOWER);
          break;
        case EffectId.EXECUTE:
          gameEngine.insertBuff(minion, EffectId.EXECUTE);
          break;
        default:
          return error("Effect not found.");
      }
    }

    $game.gameLogs.push({
      type: LogType.SUMMON,
      field,
      player: player.name,
      minionId: minion.id
    });

    await gameEngine.saveGame($game);
  });
};

export {playMinion};
