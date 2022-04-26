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
    !$gameStore.player.minion[field];
  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;

  $: minion = $gameStore.player.minion[field];

  const getCard = (): any => {
    const card = cards.find(({id}) => id === minion.id);
    const gid = minion.gid;

    return {...card, gid};
  };

  const onPlayCard = (): void => {
    if (!isCurrentPlayer) { return; }
    if (!$selectedCardStore.hand.gid) { return; }
    if ($selectedCardStore.hand.type !== CardType.MINION) { return; }
    if ($selectedCardStore.field !== "") { $selectedCardStore.field = ""; }

    const {gid} = $selectedCardStore.hand;

    socket.emit("playMinion", {field, gid});

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

  const onMouseenter = (): void => {
    if (isCurrentPlayer) { socket.emit("hoverCard", {field}); }
  }

  const onMouseleave = (): void => {
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
    box-shadow: $elevation-sm;
    cursor: not-allowed;
    transition: transform 225ms ease-in-out;
  }

  .field:hover {transform: translateY(-8px);}

  .isSelected {box-shadow: 0 0 0 4px white;}

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

{#if minion}
  <div class="field" class:isSelected on:click={onAttackSelect} on:mouseenter={onMouseenter} on:mouseleave={onMouseleave}>
    <Card card={getCard()} health={minion.health} damage={minion.damage} isHealthBarVisible={true}/>
  </div>
{:else}
  <div class="field" class:isSummonable on:click={onPlayCard} on:mouseenter={onMouseenter} on:mouseleave={onMouseleave}>
    <span>Minion Field {field}</span>
  </div>
{/if}
