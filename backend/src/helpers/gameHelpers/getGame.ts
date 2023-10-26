import {mongo} from "app";
import type {WithId} from "mongodb";
import type {Game, GamePlayer} from "@som/shared/types/mongo";

interface Response {
  $game: WithId<Game>;
  player: GamePlayer;
  opponent: GamePlayer;
}

type GetGame = (socketId: string) => Promise<[Response | undefined, string]>;

const getGame: GetGame = async (socketId) => {
  const {$games, $players} = mongo;
  const $player = await $players.findOne({socketId});

  if (!$player) {
    return [, "Player not found, try relogging."];
  }

  const {name} = $player;
  const id = $player.gameId;
  const $game = await $games.findOne({id});

  if (!$game) {
    return [, "Game not found."];
  }

  const {playerA, playerB} = $game;
  const player = playerA.name === name ? playerA : playerB;
  const opponent = playerA.name === name ? playerB : playerA;

  if ($game.currentPlayer !== player.name) {
    return [, "It's not your turn."];
  }

  return [{$game, player, opponent}, ""];
};

export {getGame};
