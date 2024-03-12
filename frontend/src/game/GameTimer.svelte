<script lang="ts">
  import {socketService, soundService} from "services";
  import {gameStore, nodeStore, playerStore, selectedCardStore} from "stores";
  import {ButtonComponent} from "ui";

  $: height = $nodeStore.barHeight;
  $: disabled = $playerStore.name !== $gameStore.currentPlayer;

  const onEndTurn = (): void => {
    $selectedCardStore.field = undefined;
    $selectedCardStore.graveyard = undefined;
    $selectedCardStore.hand = undefined;

    soundService.play("endTurn");
    socketService.socket.emit("endTurn");
  };

  const onLine = (): void => {
    let isPlayer = false;
    let attacker = "d";
    let attacked = "d";

    let height = "0px";
    let rotate = "0deg";
    let translateX = "0";

    const A_A = attacker === "a" && attacked === "a";
    const A_B = attacker === "a" && attacked === "b";
    const A_H = attacker === "a" && attacked === "hero";
    const A_C = attacker === "a" && attacked === "c";
    const A_D = attacker === "a" && attacked === "d";

    const B_A = attacker === "b" && attacked === "a";
    const B_B = attacker === "b" && attacked === "b";
    const B_H = attacker === "b" && attacked === "hero";
    const B_C = attacker === "b" && attacked === "c";
    const B_D = attacker === "b" && attacked === "d";

    const C_A = attacker === "c" && attacked === "a"
    const C_B = attacker === "c" && attacked === "b";
    const C_H = attacker === "c" && attacked === "hero";
    const C_C = attacker === "c" && attacked === "c";
    const C_D = attacker === "c" && attacked === "d";

    const D_A = attacker === "d" && attacked === "a";
    const D_B = attacker === "d" && attacked === "b";
    const D_H = attacker === "d" && attacked === "hero";
    const D_C = attacker === "d" && attacked === "c";
    const D_D = attacker === "d" && attacked === "d";

    if (isPlayer) {
      if (A_D || B_C || C_B || D_A) { // 0 deg
        rotate = "0deg";

        switch (attacker) {
          case "a": translateX = "-324px"; break;
          case "b": translateX = "-162px"; break;
          case "c": translateX = "162px"; break;
          case "d": translateX = "324px"; break;
        }

        height = "454px";
      } else if (A_C || D_B || B_H || C_H || C_A || B_D) { // 19 deg
        if (A_C || B_H || C_A) {
          rotate = "19deg";
        } else {
          rotate = "339deg";
        }

        if (D_B || C_A) {
          translateX = "244px";
        } else if (A_C || B_D) {
          translateX = "-244px";
        } else if (B_H) {
          translateX = "-82px";
        } else {
          translateX = "82px";
        }

        height = "476px";
      } else if (A_H || B_B || C_C || D_H) { // 35 deg
        if (A_H || B_B) {
          rotate = "35deg";
        } else {
          rotate = "324deg";
        }

        switch (attacker) {
          case "a": translateX = "-162px"; break;
          case "b": translateX = "2px"; break;
          case "c": translateX = "2px"; break;
          case "d": translateX = "164px"; break;
        }

        height = "554px";
      } else if (A_B || C_D || B_A || D_C) { // 45 deg
        if (A_B || B_A) {
          rotate = "47deg";
        } else {
          rotate = "313deg";
        }

        switch (attacker) {
          case "a": translateX = "-82px"; break;
          case "b": translateX = "87px"; break;
          case "c": translateX = "-82px"; break;
          case "d": translateX = "87px"; break;
        }

        height = "662px";
      } else if (A_A || D_D) { // 55deg
        if (A_A) {
          rotate = "55deg";
        } else {
          rotate = "305deg";
        }

        translateX = "0";
        height = "780px";
      }

    } else {

      if (A_D || B_C || C_B || D_A) { // 0 deg
        rotate = "0deg";

        switch (attacker) {
          case "a": translateX = "324px"; break;
          case "b": translateX = "162px"; break;
          case "c": translateX = "-162px"; break;
          case "d": translateX = "-324px"; break;
        }

        height = "454px";
      } else if (A_C || D_B || B_H || C_H || C_A || B_D) { // 19 deg
        if (A_C || B_H || C_A) {
          rotate = "-339deg";
        } else {
          rotate = "-19deg";
        }

        if (D_B || C_A) {
          translateX = "-244px";
        } else if (A_C || B_D) {
          translateX = "244px";
        } else if (B_H) {
          translateX = "82px";
        } else {
          translateX = "-82px";
        }

        height = "476px";
      } else if (A_H || B_B || C_C || D_H) { // 35 deg
        if (A_H || B_B) {
          rotate = "-324deg";
        } else {
          rotate = "-35deg";
        }

        switch (attacker) {
          case "a": translateX = "162px"; break;
          case "b": translateX = "-2px"; break;
          case "c": translateX = "-2px"; break;
          case "d": translateX = "-164px"; break;
        }

        height = "554px";
      } else if (A_B || C_D || B_A || D_C) { // 45 deg
        if (A_B || B_A) {
          rotate = "-313deg";
        } else {
          rotate = "-47deg";
        }

        switch (attacker) {
          case "a": translateX = "82px"; break;
          case "b": translateX = "-87px"; break;
          case "c": translateX = "82px"; break;
          case "d": translateX = "-87px"; break;
        }

        height = "662px";
      } else if (A_A || D_D) { // 55deg
        if (A_A) {
          rotate = "-305deg";
        } else {
          rotate = "-55deg";
        }

        translateX = "0";
        height = "780px";
      }
    }

    let transform = `translate(${translateX}, -50%) rotate(${rotate})`;

    nodeStore.update((store) => {
      store.lineCss = `transform: ${transform}; height: ${height}`;
      store.showLine = true;

      return store;
    });

    setTimeout((): void => {
      nodeStore.update((store) => {
        store.showLine = false;
        return store;
      });
    }, 666);
  };
</script>

<style>
  .game-timer {
    position: absolute;
    top: 50%;
    right: 0;
    height: 80%;
    width: 160px;
    display: flex;
    align-items: center;
    transform: translateY(-50%);
    /* margin-right: var(--md); */
  }

  .bar {
    height: 90%;
    width: 12px;
    /* margin: var(--md) 0 var(--md) 0; */
    /* box-sizing: border-box; */
    margin-left: 8px;
    background-color: rgb(31, 31, 31);
  }
  .progress {
    height: 60%;
    width: 8px;
    margin: 2px;
    /* box-sizing: border-box; */
    background-color: rgb(var(--primary));
  }

.info {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .glow {
    animation: glow4 1s ease-in-out infinite alternate;
    color: rgb(var(--primary));
  }

  @keyframes glow4 {
    from {
      text-shadow: 0 0 0 rgb(var(--primary));
      transform: scale(1);
    } to {
      text-shadow: 2px 2px 32px rgb(var(--primary));
      transform: scale(1.2);
    }
  }


  .bgd {
    /* width: 75%; */
    /* text-align: center; */
    padding: var(--sm) var(--lg);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>

<div class="game-timer">
  <div class="info">
    <div class="bgd" class:glow={$gameStore.opponent.name === $gameStore.currentPlayer}>{$gameStore.opponent.name}</div>
    <ButtonComponent {disabled} on:click={onEndTurn}>END TURN</ButtonComponent>
    <!-- <ButtonComponent on:click={onLine}>LINE</ButtonComponent> -->
    <div class="bgd" class:glow={$playerStore.name === $gameStore.currentPlayer}>{$gameStore.player.name}</div>
  </div>
  <div class="bar">
    <div class="progress" style:height></div>
  </div>
</div>
