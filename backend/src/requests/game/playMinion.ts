import {CardType, EffectId, LogType} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import { Animations } from "@som/shared/types/game";

const playMinion: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("playMinion", async (params) => {
    const animations: Animations = [];
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;
    const {field, gid} = params;

    if (player.field[field]) {
      return error("Field already inhibits a Minion.");
    }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.MINION) {
      return error("Selected card is not Minion.");
    }

    if (card.manaCost.current > player.field.hero.mana.current) {
      return error("Not enough mana.");
    }

    player.field.hero.mana.current -= card.manaCost.current;
    player.field[field] = card;

    const minion = player.field[field];

    if (!minion) {
      return error("Error summoning card.");
    }

    player.hand.splice(player.hand.indexOf(card), 1);

    animations.push({
      type: "SUMMON",
      name: player.name,
      field,
      minion,
      necromancyFixPositive: false
    }, {
      type: "MANA_CAPACITY",
      increment: -minion.manaCost.current,
      field: "hero",
      name: player.name
    });

    const {trap} = opponent;
    const isElusive = minion.effect === EffectId.ELUSIVE;

    // Step 1: Insert buffs / debuffs
    // Step 2: Check for on summon trap cards
    // Step 3: Trigger on summon effects

    // [1] INSERT BUFFS / DEBUFFS
    switch (minion.effect) {
      case EffectId.BLAZE: // Neutral
        const hasAttackedTwice = true;
        gameHelpers.insertBuff(minion, EffectId.BLAZE, {hasAttackedTwice});
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "BLAZE"
        });
        break;
      case EffectId.ELUSIVE:
        gameHelpers.insertBuff(minion, EffectId.ELUSIVE);
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "ELUSIVE"
        });
        break;
      case EffectId.REVENGE:
        gameHelpers.insertBuff(minion, EffectId.REVENGE);
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "REVENGE"
        });
        break;
      case EffectId.UNITY: // Solid
        gameHelpers.insertBuff(minion, EffectId.UNITY);
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "UNITY"
        });
        break;
      case EffectId.UNBREAKABLE:
        gameHelpers.insertBuff(minion, EffectId.UNBREAKABLE);
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "UNBREAKABLE"
        });
        break;
      case EffectId.PROTECTOR:
        gameHelpers.insertBuff(minion, EffectId.TAUNT);
        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: player.name,
          text: "TAUNT"
        });
        break;
      case EffectId.RISING_FURY: // Liquid
        gameHelpers.insertBuff(minion, EffectId.RISING_FURY);
        break;
      case EffectId.REGENERATION:
        gameHelpers.insertBuff(minion, EffectId.REGENERATION);
        break;
      case EffectId.SACRIFICE:
        gameHelpers.insertBuff(minion, EffectId.SACRIFICE);
        break;
      case EffectId.SHADOWSTRIKE:
        gameHelpers.insertBuff(minion, EffectId.SHADOWSTRIKE);
        break;
      case EffectId.LEECH:
        gameHelpers.insertBuff(minion, EffectId.LEECH);
        break;
      case EffectId.RESILIENT:
        gameHelpers.insertBuff(minion, EffectId.RESILIENT);
        break;
      // Gas
      case EffectId.ACIDIC_DEATH:
        gameHelpers.insertBuff(minion, EffectId.ACIDIC_DEATH);
        break;
      case EffectId.STEALTH:
        gameHelpers.insertBuff(minion, EffectId.STEALTH);
        break;
      case EffectId.POISONOUS_TOUCH:
        gameHelpers.insertBuff(minion, EffectId.POISONOUS_TOUCH);
        break;
      case EffectId.CORROSIVE_TOUCH:
        gameHelpers.insertBuff(minion, EffectId.CORROSIVE_TOUCH);
        break;
      // ---------- [ P L A S M A ] ----------
      case EffectId.SELF_DESTRUCT:
        gameHelpers.insertBuff(minion, EffectId.SELF_DESTRUCT);
        break;
      case EffectId.RAMPAGE:
        gameHelpers.insertBuff(minion, EffectId.RAMPAGE);
        break;
      case EffectId.BACKSTAB:
        gameHelpers.insertBuff(minion, EffectId.BACKSTAB);
        break;
      case EffectId.MARKSMANSHIP:
        gameHelpers.insertBuff(minion, EffectId.MARKSMANSHIP);
        break;
      case EffectId.OVERPOWER:
        gameHelpers.insertBuff(minion, EffectId.OVERPOWER);
        break;
      case EffectId.EXECUTE:
        gameHelpers.insertBuff(minion, EffectId.EXECUTE);
        break;
    }

    // [2] ON SUMMON TRAP TRIGGERS
    if (trap && !isElusive) {
      switch (trap.effect) {
        case EffectId.SMITE:
          animations.push(...effect.smite({player, opponent, minion, trap, field}));
          break;
        case EffectId.BANISH:
          effect.banish({
            player,
            opponent,
            playerMinion: minion,
            opponentTrap: trap,
            playerMinionField: field
          });
          break;
        case EffectId.POISONED_GROUND:
          effect.poisonedGround({player: opponent, minion, trap});
          break;
      }
    } else {
      // [3] TRIGGER ON SUMMON EFFECTS
      switch (minion.effect) {
        case EffectId.SHADOW_SURGE: // Neutral
          animations.push(...effect.shadowSurge.onNormalSummon({
            player,
            playerMinion: minion,
            playerMinionField: field
          }));

          break;
        case EffectId.QUICK_SHOT:
          animations.push(...effect.quickShot({opponent}));
          break;
        case EffectId.NECROMANCY:
          animations.push(...effect.necromancy({
            player,
            playerMinion: minion,
            playerMinionField: field,
            isPositive: false
          }));
          break;
        case EffectId.GLORY: // Solid
          animations.push(...effect.glory({
            player,
            opponent,
            minion,
            playerMinionField: field,
          }));
          break;
        case EffectId.SPELLWEAVE:
          animations.push(...effect.spellweave({
            player,
            playerMinion: minion,
            playerMinionField: field
          }));
          break;
        case EffectId.SHIELDWALL:
          animations.push(...effect.shieldwall({
            player,
            playerMinionField: field
          }));
          break;
        // ---------- [ G A S ] ----------
        case EffectId.TOXIC_SPRAY:
          effect.toxicSpray({opponent});
          break;
        case EffectId.TOXIC_GAS:
          effect.toxicGas({opponent});
          break;
      }
    }

    $game.gameLogs.push({
      type: LogType.SUMMON,
      field,
      player: player.name,
      minionId: minion.id
    });

    

    // await gameHelpers.saveGame($game, animations);
    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {playMinion};
