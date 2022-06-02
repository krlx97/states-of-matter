<script lang="ts">
  import {cards} from "@som/shared/data";
  import { CardType } from "@som/shared/enums";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;

  const {socket} = socketService;

  const onPlayCard = (id: number, gid: number): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }
    if ($selectedCardStore.field !== "") { $selectedCardStore.field = ""; }

    const card = getCard(id);
    const {type} = card;

    if ($selectedCardStore.hand.gid !== gid) {
      if (type === CardType.MAGIC) {
        socket.emit("playMagic", {gid});
      } else if (type === CardType.MINION) {
        $selectedCardStore.hand = {gid, type};
      } else if (type === CardType.TRAP) {
        socket.emit("playTrap", {gid});
      }
    } else {
      $selectedCardStore.hand.gid = 0;
    }
  };

  const getCard = (id: number) => cards.find((card) => card.id === id);

  const onMouseenter = (i: number): void => {
    if (isCurrentPlayer) { socket.emit("hoverHandCard", {i}); }
  }

  const onMouseleave = (): void => {
    if (isCurrentPlayer) { socket.emit("unhoverHandCard"); }
  }
</script>

<style lang="scss">
  @use "sass:math";
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .selected {animation: glow 900ms $ease-in-out-quart infinite}

  @keyframes glow {
    0%    {box-shadow: 0 0 8px 4px $orange}
    50%   {box-shadow: 0 0 10px 5px $orange}
    100%  {box-shadow: 0 0 8px 4px $orange}
  }

  .hand {
    display: flex;
    position: absolute;
    bottom: -144px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;

    &__card {
      height: $card-height;
      width: $card-width;
      transition: transform 225ms $ease-in-out-quart;
    }
    &__card:hover {
      transform: translateY(-144px);
    }
    // &__card:hover~&__card {
    //   transform: translateX(math.div($card-width, 2));
    // }
    // &__card:not(:first-child) {
    //   margin-left: math.div(-$card-width, 2);
    // }
  }
</style>

<div class="hand">
  {#each $gameStore.player.hand as {id, gid}, i}
    <div
      class="hand__card"
      class:selected={gid === $selectedCardStore.hand.gid}
      on:mouseenter={() => onMouseenter(i)}
      on:mouseleave={() => onMouseleave()}
      on:click={() => onPlayCard(id, gid)}>
      <Card card={getCard(id)} health={1} damage={1}/>
    </div>
  {/each}
</div>
