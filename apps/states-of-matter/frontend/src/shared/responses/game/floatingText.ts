import {socketService} from "services";
import {floatingTextStore, playerStore} from "stores";

const floatingText = (): void => {
  const {socket} = socketService;

  socket.on("floatingText", (params: any): void => {
    floatingTextStore.update((store) => {
      store.player[params.attacker].push({
        id: Math.floor(Math.random() * 1e6),
        animationId: 0,
        text: `<img src="assets/attrs/health.png"> -${params.attackedDamage}`,
        frame: 0,
        bottom: 0,
        left: Math.floor(Math.random() * 96),
        opacity: 1
      });

      store.opponent[params.attacked].push({
        id: Math.floor(Math.random() * 1e6),
        animationId: 0,
        text: `<img src="assets/attrs/health.png"> -${params.attackerDamage}`,
        frame: 0,
        bottom: 0,
        left: Math.floor(Math.random() * 96),
        opacity: 1
      });

      var audio = new Audio("assets/sounds/attack.mp3");
      audio.play();

      return store;
    });
  });
};

export {floatingText};
