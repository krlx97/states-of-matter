<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {cards} from "@som/shared/data";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";

  export let field: "a" | "b" | "c" | "d";

  const {socket} = socketService;

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
    const _field: any = `minion${field}`;

    socket.emit("playCard", {field: _field, gid});

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

  const mouseEnter = (): void => {
    if (isCurrentPlayer) { socket.emit("hoverCard", {field}); }
  }
  const onMouseLeave = (): void => {
    if (isCurrentPlayer) { socket.emit("unhoverCard"); }
  }
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include d-flex(row, center, center);
    // background-color: $orange;
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

{#if field === "a"}
  {#if $gameStore.player.fields.minionA}
    <div class="field" class:isSelected on:click={onAttackSelect} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <Card
        card={getCard("minionA")}
        health={$gameStore.player.fields.minionA.health}
        damage={$gameStore.player.fields.minionA.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
    <div class="field" class:isSummonable on:click={onPlayCard} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
{:else if field === "b"}
  {#if $gameStore.player.fields.minionB}
    <div class="field" class:isSelected on:click={onAttackSelect} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <Card
        card={getCard("minionB")}
        health={$gameStore.player.fields.minionB.health}
        damage={$gameStore.player.fields.minionB.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
    <div class="field" class:isSummonable on:click={onPlayCard} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
{:else if field === "c"}
  {#if $gameStore.player.fields.minionC}
    <div class="field" class:isSelected on:click={onAttackSelect} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <Card
        card={getCard("minionC")}
        health={$gameStore.player.fields.minionC.health}
        damage={$gameStore.player.fields.minionC.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
    <div class="field" class:isSummonable on:click={onPlayCard} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
{:else if field === "d"}
  {#if $gameStore.player.fields.minionD}
    <div class="field" class:isSelected on:click={onAttackSelect} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <Card
        card={getCard("minionD")}
        health={$gameStore.player.fields.minionD.health}
        damage={$gameStore.player.fields.minionD.damage}
        isHealthBarVisible={true}
      />
    </div>
  {:else}
    <div class="field" class:isSummonable on:click={onPlayCard} on:mouseenter={mouseEnter} on:mouseleave={onMouseLeave}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
{/if}
