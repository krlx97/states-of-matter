<script lang="ts">
  import {gameStore, playerStore} from "stores";

  // $: isPlayerLog = $playerStore.name === log.player;
</script>

<style>
  .battle-logs {
    height: 100%;
    padding-bottom: var(--spacing-md);
    display: flex;
    flex-direction: column;
    /* background: linear-gradient(90deg, rgba(121,108,254,0.20) 0%, rgba(31,31,31,0) 100%); */
    backdrop-filter: blur(2px);
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .battle-logs::-webkit-scrollbar {
    width: 8px;
  }
  .battle-logs::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }
  .battle-logs::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .green {
    color: rgb(var(--green));
  }
  .red {
    color: rgb(var(--red));
  }
  .battle-log {
    width: 96px;
    margin: var(--spacing-md);
    margin-bottom: 0;
    display: flex;
    background-color: rgb(47, 47, 47);
    border: 4px solid rgb(47, 47, 47);
    border-right-width: 0;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .battle-log__img {
    display: block;
    border: 1px solid rgb(121, 108, 254);
    border-radius: 8px;
  }
  .battle-log__symbol {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="battle-logs">
  {#each $gameStore.battleLogs as log}
    {#if log.type === 0}
      <div class="battle-log">
        <img class="battle-log__img" src="assets/cards/sm/{log.with}.jpg" alt="Card"/>
        <div class="battle-log__symbol">
          <i
            class="fa-solid fa-khanda fa-fw"
            class:green={$playerStore.name === log.playerAtk}
            class:red={$playerStore.name !== log.playerDef}
          ></i>
          <!-- {log.playerAtk} -->
        </div>
        <!-- <div>
          ATTACKED
          <br/>
          {log.attacker.toUpperCase()} -> {log.attacked.toUpperCase()}
        </div> -->
        <!-- <div class="battle-log__card"> -->
          <!-- {log.playerDef} -->
          <!-- <img src="assets/cards/sm/{log.target}.jpg" alt="Card"/> -->
        <!-- </div> -->
      </div>
    {:else}
      <div class="battle-log">
        <img
          class="battle-log__img"
          src="assets/cards/sm/{log.minionId}.jpg"
          alt="Card"
        />
        <div class="battle-log__symbol">
          <i
            class="fa-solid fa-star fa-fw"
            class:green={$playerStore.name === log.player}
            class:red={$playerStore.name !== log.player}
          ></i>
          
        </div>
      </div>
    {/if}
  {/each}
</div>
