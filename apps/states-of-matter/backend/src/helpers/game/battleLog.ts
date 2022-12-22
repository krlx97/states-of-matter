import {LogType, type Game, AttackLog} from "models/game";

const battleLog = (
  game: Game,
  player: any,
  opponent: any,
  attacked: any,
  attacker: any,
  playerMinionId: number,
  opponentMinionId: number,
): void => {
  const attackLog: AttackLog = {
    type: LogType.ATTACK,
    playerAtk: player.username,
    playerDef: opponent.username,
    with: playerMinionId,
    target: opponentMinionId,
    attacked,
    attacker
  };

  game.battleLogs.push(attackLog);
};

export {battleLog};
