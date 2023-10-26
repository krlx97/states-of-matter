import {CardType} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const playTrap: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("playTrap", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player} = getGameData;
    const {name, hand, trap} = player;
    const {gid} = params;

    if (trap) {
      return error("Trap Card is already set.");
    }

    const card = hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.TRAP) {
      return error("Selected card is not Trap.");
    }

    if (card.manaCost > player.field.hero.mana) {
      return error("Not enough mana.");
    }

    player.field.hero.mana -= card.manaCost;
    hand.splice(hand.indexOf(card), 1);
    player.trap = card;

    socket.emit("playTrap", {name});

    await gameHelpers.saveGame($game);
  });
};

export {playTrap};
