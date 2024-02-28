<script lang="ts">
  import {onMount} from "svelte";
  import {cardEffectNames} from "@som/shared/data";

  import {
    floatingTextStore,
    gameStore,
    nodeStore,
    playerStore,
    selectedCardStore
  } from "stores";

  import {CardComponent, TextComponent} from "ui";
  import FloatingTextComponent from "../FloatingText.svelte";
    import { fly } from "svelte/transition";

  let fieldElement: HTMLDivElement;
  let damageDealtElement: HTMLDivElement;

  $: card = $gameStore.player.field.hero;
  $: isSelected = $selectedCardStore.field === "hero";
  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;

  const onAbilitySelect = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    $selectedCardStore.hand = undefined;
    $selectedCardStore.graveyard = undefined;

    if ($selectedCardStore.field !== "hero") {
      $selectedCardStore.field = "hero";
    } else {
      $selectedCardStore.field = undefined;
    }
  };

  onMount((): void => {
    $nodeStore.player.hero = fieldElement;
    $nodeStore.player.heroDamage = damageDealtElement;
  });

</script>

<style>
  .hero {
    position: relative;
    z-index: 0;
  }

  .damage-dealt {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(var(--dark-grey), 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: rgb(var(--warn));
    font-size: 128px;
    visibility: hidden;
    z-index: 5;
  }

.buffs {
    position: absolute;
    bottom: calc(100% + 16px);
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

<div class="hero" bind:this={fieldElement}>
  {#if $floatingTextStore.player.hero}
    <div class="floating-text" in:fly={{y: 64, duration: 1000, opacity: 1}}>
      {$floatingTextStore.player.hero}
    </div>
  {/if}
  <div class="buffs">
    {#each $gameStore.player.field.hero.buffs as buff}
      <TextComponent color="success">
        {cardEffectNames.get(buff.id)}
        {#if buff.data}
          ({Object.values(buff.data)})
        {/if}
      </TextComponent>
    {/each}
    {#each $gameStore.player.field.hero.debuffs as debuff}
      <TextComponent color="warn">{cardEffectNames.get(debuff.id)}</TextComponent>
    {/each}
  </div>
  {#key $gameStore.player.field.hero.id}
    <CardComponent {card} {isSelected} on:click="{onAbilitySelect}"/>
  {/key}
  <div class="damage-dealt" bind:this={damageDealtElement}></div>
</div>
