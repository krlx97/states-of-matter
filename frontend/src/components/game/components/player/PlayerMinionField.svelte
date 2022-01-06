<script lang="ts">
  import {cards} from "data";
  import {socketService} from "services";
  import {gameStore, selectedCardStore} from "game/stores";
  import {CardComponent} from "components";
  import {CardType} from "enums";
  import type {SelectedCardField} from "game/stores/selected-card/selected-card.model";
import { playerStore } from "stores/data";

  let field: SelectedCardField;

  $: isSelected = $selectedCardStore.field === field;

  $: isSummonable =
    $selectedCardStore.hand.gid &&
    $selectedCardStore.hand.type === CardType.MINION &&
    !$gameStore.player.fields[`minion${field}`];

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;

  const getCard = (field: string): any => {
    const card = cards.find(({id}) => id === $gameStore.player.fields[field].id);
    const gid = $gameStore.player.fields[field].gid;

    return {...card, gid};
  };

  const onPlayCard = (): void => {
    if (!isCurrentPlayer) { return; }
    if (!$selectedCardStore.hand.gid) { return; }
    if ($selectedCardStore.hand.type !== CardType.MINION) { return; }
    if ($selectedCardStore.field !== "") { $selectedCardStore.field = ""; }

    const {gid} = $selectedCardStore.hand;
    socketService.emit("playCard", {field: `minion${field}`, gid});

    $selectedCardStore.hand.gid = 0;
  };

  const onAttackSelect = (): void => {
    if (!isCurrentPlayer) { return; }
    if ($selectedCardStore.hand.gid) { $selectedCardStore.hand.gid = 0; }

    if ($selectedCardStore.field === field) {
      $selectedCardStore.field = "";
    } else {
      $selectedCardStore.field = field;
    }
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../../styles/mixins";
  @import "../../../../styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include d-flex(row, center, center);
    background-color: $orange;
    box-shadow: $elevation-sm;
    cursor: not-allowed;
  }

  .isSelected {
    box-shadow: 0 0 4px 2px $purple;
  }
  .isSummonable {
    animation: glow 1s $ease-in-out-quart infinite;
    cursor: pointer;
  }

  @keyframes glow {
    0%    {box-shadow: 0 0 4px 2px $orange}
    50%   {box-shadow: 0 0 8px 4px $orange}
    100%  {box-shadow: 0 0 4px 2px $orange}
  }
</style>

{#if field === "A"}
  {#if $gameStore.player.fields.minionA}
    <div class="field" class:isSelected on:click={onAttackSelect}>
      <CardComponent
        card={getCard("minionA")}
        health={$gameStore.player.fields.minionA.health}
        damage={$gameStore.player.fields.minionA.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
    <div class="field" class:isSummonable on:click={onPlayCard}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
{:else if field === "B"}
  {#if $gameStore.player.fields.minionB}
    <div class="field" class:isSelected on:click={onAttackSelect}>
      <CardComponent
        card={getCard("minionB")}
        health={$gameStore.player.fields.minionB.health}
        damage={$gameStore.player.fields.minionB.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
  <div class="field" class:isSummonable on:click={onPlayCard}>
    <span>Minion Field {field}</span>
  </div>
  {/if}
{:else if field === "C"}
  {#if $gameStore.player.fields.minionC}
    <div class="field" class:isSelected on:click={onAttackSelect}>
      <CardComponent
        card={getCard("minionC")}
        health={$gameStore.player.fields.minionC.health}
        damage={$gameStore.player.fields.minionC.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
  <div class="field" class:isSummonable on:click={onPlayCard}>
    <span>Minion Field {field}</span>
  </div>
  {/if}
{:else if field === "D"}
  {#if $gameStore.player.fields.minionD}
    <div class="field" class:isSelected on:click={onAttackSelect}>
      <CardComponent
        card={getCard("minionD")}
        health={$gameStore.player.fields.minionD.health}
        damage={$gameStore.player.fields.minionD.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
  <div class="field" class:isSummonable on:click={onPlayCard}>
    <span>Minion Field {field}</span>
  </div>
  {/if}
{/if}
