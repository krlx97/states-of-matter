<script lang="ts">
  import {cards} from "@som/shared/data";
  import {miscService} from "services";
  import {gameStore} from "stores";
  import Card from "../../ui/Card.svelte";

  const onViewGraveyard = (): void => {
    miscService.openModal("graveyard", $gameStore.opponent.graveyard);
  };
</script>

<style>
  .graveyard {
    height: 216px;
    width: 144px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgb(var(--purple));
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard} on:keypress={onViewGraveyard}>
  {#if $gameStore.opponent.graveyard.length}
    <Card
      card={cards.find((card) => card.id === $gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1].id)}
      isClient={false}
    />
  {:else}
    Graveyard
  {/if}
</div>
