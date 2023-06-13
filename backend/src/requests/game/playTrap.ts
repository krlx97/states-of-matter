import {CardType} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const playTrap: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("playTrap", async (params) => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player} = getGameData;
    const {gid} = params;

    if (player.trap) {
      return error("Trap Card is already set.");
    }

    const card = player.hand.find((card) => card.gid === gid);

    if (!card) {
      return error("Card not found in hand.");
    }

    if (card.type !== CardType.TRAP) {
      return error("Selected card is not Trap.");
    }

    if (card.manaCost > player.hero.mana) {
      return error("Not enough mana.");
    }

    player.hero.mana -= card.manaCost;
    player.hand.splice(player.hand.indexOf(card), 1);
    player.trap = card;

    await gameEngine.saveGame($game);
  });
};

export {playTrap};
