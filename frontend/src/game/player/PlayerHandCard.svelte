<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {CardComponent} from "ui";
  import type {GameMagicCard, GameMinionCard, GameTrapCard} from "@som/shared/types/backend/game";

  const {socket} = socketService;
  let card: GameMagicCard | GameMinionCard | GameTrapCard;
  $: isSelected = $selectedCardStore.hand && card.gid === $selectedCardStore.hand.gid;

  const onSelectCard = (): void => {
    const {gid, type} = card;

    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if ($selectedCardStore.field !== undefined) { $selectedCardStore.field = undefined; }

    if (type === CardType.MAGIC) {
      socket.emit("playMagic", {gid});
    } else if (type === CardType.MINION) {
      if ($selectedCardStore.hand && $selectedCardStore.hand.gid === card.gid) {
        $selectedCardStore.hand = undefined;
      } else {
        $selectedCardStore.hand = card;
      }
    } else if (type === CardType.TRAP) {
      socket.emit("playTrap", {gid});
    }
  };

  export {card};
</script>

<style>
  .hand-card {
    transition: transform 250ms cubic-bezier(var(--ease-in-out-quart));
  }

  .hand-card:hover {
    transform: translateY(-140px);
  }
</style>

<div
  class="hand-card"
  class:isSelected
  on:click={onSelectCard}
  on:keypress={onSelectCard}
>
  <CardComponent {card} isClient={false}/>
</div>
