import {socketService} from "services";
import {gameStore} from "stores";

export const attackCardReceiver = () => {
  const {socket} = socketService;

  socket.on("attackCardReceiver", (params) => {
    const {attacker, attacked} = params;

    gameStore.update((store) => {
      const {player, opponent} = store;

      let _attacker = player.fields[attacker];
      let _attacked = opponent.fields[attacked];

      if (!_attacker || !_attacked) { return; }

      _attacker.health -= _attacked.damage;
      _attacked.health -= _attacker.damage;

      if (_attacker.health <= 0 && attacker !== "hero") {
        player.graveyard.push(player.fields[attacker] as any);
        player.fields[attacker] = undefined;
      } else if (_attacked.health <= 0 && attacked !== "hero") {
        opponent.graveyard.push(opponent.fields[attacked] as any);
        opponent.fields[attacked] = undefined;
      }

      return store;
    });
  });
};
