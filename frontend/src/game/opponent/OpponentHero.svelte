<script lang="ts">
  import {socketService, soundService} from "services";
  import {gameStore, selectedCardStore, playerStore, floatingTextStore, nodeStore} from "stores";
  import {CardComponent} from "ui";
    import FloatingText from "../FloatingText.svelte";
    import { onMount } from "svelte";

  $: isAttackable = $selectedCardStore.field !== undefined;
  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  const onAttackHero = (): void => {
    const attacker = $selectedCardStore.field;

    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if (!attacker) { return; }

    soundService.play("directAttack");
    socketService.socket.emit("attackHero", {attacker});
  };

  onMount((): void => {
    $nodeStore.opponent.hero = fieldElement;
    $nodeStore.opponent.heroDamage = damageDealtElement;
  });
</script>

<style>
  .hero {
  position: relative;
    /* height: 216px;
    width: 144px; */
    /* border: 2px solid rgb(96, 133, 29); */
    /* border-radius: 8px; */
  }

.isAttackable {
    /* animation: glow2 1s cubic-bezier(var(--ease-in-out-quart)) infinite; */
    position: relative;
    cursor: pointer;
  }
 .isAttackable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 8px 2px rgb(var(--green));
    animation: isAttackableGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes isAttackableGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

.damage-dealt {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(31, 31, 31, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: rgb(var(--warn));
    font-size: 128px;
    visibility: hidden;
    z-index: 5;
  }
</style>

<div class="hero" bind:this={fieldElement} class:isAttackable>
  {#if $floatingTextStore.opponent.hero}
    <FloatingText field="hero"/>
  {/if}
  <CardComponent
    card="{$gameStore.opponent.field.hero}"
    on:click="{onAttackHero}"/>
  <div class="damage-dealt" bind:this={damageDealtElement}></div>

</div>
