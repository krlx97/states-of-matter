<script lang="ts">
  import {cards} from "@som/shared/data";
  import {CardType} from "@som/shared/enums";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;

  const {socket} = socketService;

  const onPlayCard = (id: number, gid: number): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
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

<style>
  .selected {
    animation: glow 900ms cubic-bezier(var(--ease-in-out-quart)) infinite;
  }

  @keyframes glow {
    0%    {box-shadow: 0 0 8px 4px rgb(var(--orange));}
    50%   {box-shadow: 0 0 10px 5px rgb(var(--orange));}
    100%  {box-shadow: 0 0 8px 4px rgb(var(--orange));}
  }

  .hand {
    display: flex;
    position: absolute;
    bottom: -144px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
  }

  .hand__card {
    height: var(--card-height);
    width: var(--card-width);
    transition: transform 225ms cubic-bezier(var(--ease-in-out-quart));
  }

  .hand__card:hover {
    transform: translateY(-144px);
  }
</style>

<div class="hand">
  {#each $gameStore.player.hand as {id, gid}, i}
    <div
      class="hand__card"
      class:selected={gid === $selectedCardStore.hand.gid}
      on:mouseenter={() => onMouseenter(i)}
      on:mouseleave={() => onMouseleave()}
      on:click={() => onPlayCard(id, gid)}
      on:keypress={() => onPlayCard(id, gid)}>
      <Card card={getCard(id)} health={1} damage={1} isClient={false}/>
    </div>
  {/each}
</div>
