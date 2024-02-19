<script lang="ts">
    import { cardsView } from "@som/shared/data";
    import { LogType } from "@som/shared/enums";
  import {gameStore, playerStore} from "stores";

  // $: isPlayerLog = $playerStore.name === log.player;
</script>

<style>

  .battle-logs {
    position: absolute;
    top: 50%;
    left: var(--md);
    width: calc(96px + 128px + (var(--sm) * 3));
    height: 80%;
    /* padding-bottom: var(--md); */
    display: flex;
    flex-direction: column;
    gap: var(--md);
    /* background: linear-gradient(90deg, rgba(121,108,254,0.20) 0%, rgba(31,31,31,0) 100%); */
    /* backdrop-filter: blur(2px); */
    /* box-sizing: border-box; */
    transform: translateY(-50%);
    /* border: 1px solid red; */
    overflow-y: scroll;
    z-index: 50;
  }
  .battle-logs::-webkit-scrollbar {
    /* width: 8px; */
    display: none;
  }
  /* .battle-logs::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }
  .battle-logs::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  } */

  .green {
    color: rgb(var(--success));
  }
  .red {
    color: rgb(var(--warn));
  }
  .battle-log {
    position: relative;
    width: 96px;
    /* margin: var(--md); */
    margin-bottom: 0;
    display: flex;
    background-color: rgb(47, 47, 47);
    border: 4px solid rgb(47, 47, 47);
    border-right-width: 0;
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .battle-log:hover .battle-log__tooltip {
        visibility: visible;

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
  .battle-log__tooltip {
    width: 128px;
    position: absolute;
    top: 0;
    left: calc(100% + var(--sm));
    background-color: rgb(31, 31, 31);
border-radius: 8px;
border: 1px solid rgb(127, 127, 127);
    /* transform: translateX(-50%); */
    visibility: hidden;
    font-size: var(--font-sm);
    padding: var(--sm);
line-height: 1.25;
box-sizing: border-box;
  }
</style>

<div class="battle-logs">
  {#each $gameStore.gameLogs as log}
    {#if log.type === LogType.SUMMON}
      <div class="battle-log">
        <img class="battle-log__img" src="images/items/sm/10{log.minionId}00.png" alt="Card"/>
        <div class="battle-log__symbol">
          <i
            class="fa-solid fa-khanda fa-fw"
            class:green={$playerStore.name === log.player}
            class:red={$playerStore.name !== log.player}
          ></i>
          <!-- {log.playerAtk} -->
        </div>
        <div class="battle-log__tooltip">
          {$playerStore.name === log.player ? "You" : "Opponent"}
          played minion card
          {cardsView.find((card) => card.id === log.minionId).name} on the field {log.field}.
        </div>
        <!-- <div>
          ATTACKED
          <br/>
          {log.attacker.toUpperCase()} -> {log.attacked.toUpperCase()}
        </div> -->
        <!-- <div class="battle-log__card"> -->
          <!-- {log.playerDef} -->
          <!-- <img src="assets/cards/sm/{log.target}.png" alt="Card"/> -->
        <!-- </div> -->
      </div>
    {:else if log.type === LogType.MAGIC}
      <div class="battle-log">
        <img
          class="battle-log__img"
          src="images/items/sm/10{log.magicId}00.png"
          alt="Card"
        />
        <div class="battle-log__symbol">
          <i
            class="fa-solid fa-star fa-fw"
            class:green={$playerStore.name === log.player}
            class:red={$playerStore.name !== log.player}
          ></i>
        </div>
        <div class="battle-log__tooltip">
          {$playerStore.name === log.player ? "You" : "Opponent"} played magic card {cardsView.find((card) => card.id === log.magicId).name}.
        </div>
      </div>
    {/if}
  {/each}
</div>
