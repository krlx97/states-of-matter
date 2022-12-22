<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {socketService} from "services";

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;
  $: isSummonable = $selectedCardStore.hand.gid !== 0 && $selectedCardStore.hand.type === CardType.TRAP;

  const onMouseEnter = (): void => {
    if (isCurrentPlayer) {
      // socketService.socket.emit("hoverCard", {field: "trap"});
    }
  }

  const onMouseLeave = (): void => {
    if (isCurrentPlayer) {
      // socketService.socket.emit("unhoverCard");
    }
  }
</script>

<style>
  .field {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--red));
    border-radius: 50%;
    box-shadow: var(--elevation-sm);
  }

  .isSummonable {
    animation: glow 1s cubic-bezier(var(--ease-in-out-quart)) infinite;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 4px 2px rgb(var(--red));
    } 50% {
      box-shadow: 0 0 8px 4px rgb(var(--red));
    } 100% {
      box-shadow: 0 0 4px 2px rgb(var(--red));
    }
  }
</style>

{#if $gameStore.player.trap}
  <div
    class="field"
    class:isSummonable
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
  >
    <span>?</span>
  </div>
{/if}

