<script lang="ts">
  import {cards} from "@som/shared/data";
  import {miscService} from "services";
  import {gameStore} from "stores";
  import Card from "../../ui/Card.svelte";

  const onViewGraveyard = (): void => {
    miscService.openModal("graveyard", $gameStore.player.graveyard);
  };
</script>

<style>
  .graveyard {
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(var(--purple));
    box-shadow: var(--elevation-sm);
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard} on:keypress={onViewGraveyard}>
  {#if $gameStore.player.graveyard.length}
    <Card
      card={cards.find((card) => card.id === $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1].id)}
      isClient={false}
    />
  {:else}
    Graveyard
  {/if}
</div>
