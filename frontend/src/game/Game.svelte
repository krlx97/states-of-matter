<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {fly} from "svelte/transition";
  import {nodeStore, playerStore} from "stores";
  import {CardComponent} from "ui";
  import BattleLogsComponent from "./BattleLogs/BattleLogs.svelte";
  import GameTimerComponent from "./GameTimer.svelte";
  import OpponentComponent from "./opponent/Opponent.svelte";
  import PlayerComponent from "./player/Player.svelte";
  import type {EasingFunction, TransitionConfig} from "svelte/transition";
    import { onMount } from "svelte";

  let line;

  interface Opa {
    rgb?: string;
    delay?: number;
    duration: number;
    easing?: EasingFunction;
  }

  const opa = (
    node: Element,
    {rgb, delay, duration, easing}: Opa
  ): TransitionConfig => ({
    delay: delay || 0,
    duration,
    easing: easing || quadInOut,
    css: (t) => `
      opacity: ${t};
      background-color: rgba(var(--${rgb}), calc(0.666 - ${ t > 0 ? (t / 3).toString() : "0" }));
    `
  });

  const vibrate = (
    node: Element,
    {x, delay, duration, easing}: any
  ): TransitionConfig => ({
    delay: delay || 0,
    duration,
    easing: easing || quadInOut,
    css: (t) => {
      const translation = Math.sin(t * Math.PI) * 15;

      if (Math.floor(t * 100) % 2 === 0) {
        return `transform: translateX(${x - translation}px);`;
      } else {
        return `transform: translateX(-${x - translation}px);`;
      }
    }
  });

  onMount(() => {
    $nodeStore.line = line;
  });
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
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .connecting-line {
    position: absolute;
    border: 1px solid red;
    z-index: 1;
  }

  .trap-trigger, .magic-trigger, .trapset-trigger {
    position: absolute;
    top: 50%;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md);
    transform: translateY(-50%);
    /* background-color: rgba(var(--warn), 0.3); */
    z-index: 1000;
  }
  .magic-trigger {
    background-color: rgba(var(--primary), 0.3);
  }
  .trapset-trigger {
    background-color: rgba(var(--dark-grey), 0.3);
  }
</style>

<div class="game">
  {#if $nodeStore.turn.trigger}
    <div class="trapset-trigger" in:opa="{{duration: 3000, rgb: "black"}}">
      <div style="font-size: 48px">
        {#if $nodeStore.turn.name === $playerStore.name}
          You end your turn
        {:else}
          Your opponent ended their turn
        {/if}
      </div>
    </div>
  {/if}
  {#if $nodeStore.trap.trigger}
    <div class="trap-trigger" in:opa="{{duration: 3000, rgb: "warn", easing: quadInOut}}">
      <div>
        {#if $nodeStore.trap.name === $playerStore.name}
          Your opponent triggered a trap card
        {:else}
          You triggered a trap card
        {/if}
      </div>
      <div in:fly="{{duration: 666, y: 16, opacity: 0.9, easing: quadInOut}}">
        <CardComponent card="{$nodeStore.trap.card}"/>
      </div>
    </div>
  {/if}
  {#if $nodeStore.magic.trigger}
    <div class="magic-trigger" in:opa="{{duration: 3000, rgb: "success", easing: quadInOut}}">
      <div>
        {#if $nodeStore.magic.name === $playerStore.name}
          You played a magic card
        {:else}
          Your opponent played a magic card
        {/if}
      </div>
      <div in:fly="{{duration: 666, y: 16, opacity: 0.9, easing: quadInOut}}">
        <CardComponent card={$nodeStore.magic.card}/>
      </div>
    </div>
  {/if}
  {#if $nodeStore.trapset.trigger}
    <div class="trapset-trigger" in:opa="{{duration: 3000, rgb: "black", easing: quadInOut}}">
      <div>
        {#if $nodeStore.trapset.name === $playerStore.name}
          You set a trap card
        {:else}
          Your opponent set a trap card
        {/if}
      </div>
      <div in:fly="{{duration: 666, y: 16, opacity: 0.9, easing: quadInOut}}">
        <img src="images/card/card-back.png" alt="Card back"/>
      </div>
    </div>
  {/if}

  <BattleLogsComponent/>

  <div class="game__main">
    <OpponentComponent/>

    {#if $nodeStore.showLine}
      <div class="connecting-line" style="{$nodeStore.lineCss}"></div>
    {/if}

    <PlayerComponent/>
  </div>

  <GameTimerComponent/>
</div>
