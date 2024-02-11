<script lang="ts">
  import {CardComponent} from "ui";
  import BattleLogsComponent from "./BattleLogs/BattleLogs.svelte";
  import GameTimerComponent from "./GameTimer.svelte";
  import OpponentComponent from "./opponent/Opponent.svelte";
  import PlayerComponent from "./player/Player.svelte";
  import {gameStore, nodeStore, playerStore} from "stores";
    import { cards } from "@som/shared/data";
    import { CardId } from "../../../shared/dist/enums/CardId";
    import { fly } from "svelte/transition";
</script>

<style>
  .game {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    background-image: url("/images/gamebg.png");
    background-position: center;
    background-size: cover;
    overflow: hidden;
  }

  .game__main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .trap-trigger, .magic-trigger, .trapset-trigger {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md);
    background-color: rgba(var(--warn), 0.1);
    z-index: 1000;
    animation: redfade 800ms linear ;
  }

  .magic-trigger {
    background-color: rgba(var(--primary), 0.1);
    animation: purplefade 800ms linear ;
  }

  .trapset-trigger {
    background-color: rgba(var(--dark-grey), 0.1);
    animation: blackfade 800ms linear ;
  }

  @keyframes redfade {
    from {background-color: rgba(var(--warn), 1);}
    to {background-color: rgba(var(--warn), 0.1);}
  }
  @keyframes purplefade {
    from {background-color: rgba(var(--primary), 1);}
    to {background-color: rgba(var(--primary), 0.1);}
  }
  @keyframes blackfade {
    from {background-color: rgba(var(--dark-grey), 1);}
    to {background-color: rgba(var(--dark-grey), 0.1);}
  }
</style>

<div class="game">
  {#if $nodeStore.trap.trigger}
    <div class="trap-trigger">
      <div>
        {#if $nodeStore.trap.name === $playerStore.name}
          Your opponent triggered a trap card
        {:else}
          You triggered a trap card
        {/if}
      </div>
      <div in:fly="{{duration: 800, y: 64}}">
        <CardComponent card={$nodeStore.trap.card}/>
      </div>
    </div>
  {/if}
  {#if $nodeStore.magic.trigger}
    <div class="magic-trigger">
      <div>
        {#if $nodeStore.magic.name === $playerStore.name}
          You played a magic card
        {:else}
          Your opponent played a magic card
        {/if}
      </div>
      <div in:fly="{{duration: 800, y: 64}}">
        <CardComponent card={$nodeStore.magic.card}/>
      </div>
    </div>
  {/if}
  {#if $nodeStore.trapset.trigger}
    <div class="trapset-trigger">
      <div>
        {#if $nodeStore.trapset.name === $playerStore.name}
          You set a trap card
        {:else}
          Your opponent set a trap card
        {/if}
      </div>
      <div in:fly="{{duration: 800, y: 64}}">
        <img src="images/card/card-back.png" alt="Card back"/>
      </div>
    </div>
  {/if}
  <BattleLogsComponent/>
  <div class="game__main">
    <OpponentComponent/>
    <PlayerComponent/>
  </div>
  <GameTimerComponent/>
</div>
