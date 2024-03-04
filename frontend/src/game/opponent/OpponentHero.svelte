<script lang="ts">
  import {onMount} from "svelte";
  import {cardEffectNames} from "@som/shared/data";
  import {Ability} from "@som/shared/enums";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore, floatingTextStore, nodeStore} from "stores";
  import {CardComponent, TextComponent} from "ui";
  import FloatingTextComponent from "../FloatingText.svelte";
    import { fly } from "svelte/transition";

  let fieldElement: HTMLDivElement;
  let damageDealtElement: HTMLDivElement;

  $: card = $gameStore.opponent.field.hero;

  $: isAttackable =
    $selectedCardStore.field !== undefined &&
    $selectedCardStore.field !== "hero";

  $: isTargetable =
    ($selectedCardStore.field === "hero" && ($gameStore.player.field.hero.ability === Ability.NEUROTOXIN || $gameStore.player.field.hero.ability === Ability.OVERCHARGE));

  const onAttackHero = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) {
      return;
    }

    if ($selectedCardStore.field === "hero" && ($gameStore.player.field.hero.ability === Ability.NEUROTOXIN || $gameStore.player.field.hero.ability === Ability.OVERCHARGE)) {
      $selectedCardStore.field = undefined;

      socketService.socket.emit("useAbility" as any, {
        target: "hero"
      });
    } else if ($selectedCardStore.field !== "hero") {
      const attacker = $selectedCardStore.field;
      socketService.socket.emit("attackHero", {attacker});
      $selectedCardStore.field = undefined;
    }
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
    pointer-events: none;
  }
 .buffs {
    position: absolute;
    top: calc(100% + 16px);
    left: 50%;
    transform: translateX(-50%);
    width: 144px;
    text-align: center;
    display: flex;
    flex-direction: column;
    background-color: rgb(47, 47, 47);
    border-radius: 8px;
    line-height: 1.25;
  }

.floating-text {
    position: absolute;
    width: calc(var(--card-width) - 32px);
    height: 16px;
    bottom: calc(64px + 24px);
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    font-size: var(--xs);
    transform: translateX(-50%);
    z-index: 1000;
  }
</style>

<div class="hero" bind:this={fieldElement} class:isAttackable>
  {#if $floatingTextStore.opponent.hero}
    <div class="floating-text" in:fly={{y: 64, duration: 1000, opacity: 1}}>
      {$floatingTextStore.opponent.hero}
    </div>
  {/if}

  {#key $gameStore.opponent.field.hero.id}
    <CardComponent
      {isTargetable}
      {isAttackable}
      {card}
      on:click="{onAttackHero}"/>
  {/key}

  <div class="buffs">
    {#each $gameStore.opponent.field.hero.buffs as buff}
      <TextComponent color="success">
        {cardEffectNames.get(buff.id)}
        {#if buff.data}
          ({Object.values(buff.data)})
        {/if}
      </TextComponent>
    {/each}
    {#each $gameStore.opponent.field.hero.debuffs as debuff}
      <TextComponent color="warn">{cardEffectNames.get(debuff.id)}</TextComponent>
    {/each}
  </div>
  <div class="damage-dealt" bind:this={damageDealtElement}></div>
</div>
