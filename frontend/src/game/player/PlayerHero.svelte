<script lang="ts">
  import {floatingTextStore, gameStore, nodeStore} from "stores";
  import {CardComponent} from "ui";
    import FloatingText from "../FloatingText.svelte";
    import { onMount } from "svelte";

let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

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

<div class="hero" bind:this={fieldElement}>
  {#if $floatingTextStore.player.hero}
    <FloatingText field="hero"/>
  {/if}
  <CardComponent card={$gameStore.player.field.hero}/>
  <div class="damage-dealt" bind:this={damageDealtElement}></div>
</div>
