import {CardType} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type {Animations} from "@som/shared/types/game";

const playTrap: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("playTrap", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player} = getGameData;
    const {name, hand, trap} = player;

    if (trap) {
      return error("Trap Card is already set.");
    }

    const card = hand.find((card): boolean => card.gid === params.gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.TRAP) {
      return error("Selected card is not Trap.");
    }

    if (card.manaCost.current > player.field.hero.mana.current) {
      return error("Not enough mana.");
    }

    player.field.hero.mana.current -= card.manaCost.current;
    hand.splice(hand.indexOf(card), 1);
    player.trap = card;

    animations.push({
      type: "TRAP_SET",
      name,
      gid: card.gid
    }, {
      type: "MANA_CAPACITY",
      name,
      increment: undefined,
      decrement: card.manaCost.current
    });

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {playTrap};
