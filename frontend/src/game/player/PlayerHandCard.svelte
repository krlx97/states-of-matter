<script lang="ts">
  import {CardId, CardType} from "@som/shared/enums";
  import {modalService, socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {CardComponent} from "ui";
  import type {GameMagicCard, GameMinionCard, GameTrapCard} from "@som/shared/types/mongo";
    import EffectSelect from "../modals/EffectSelect.svelte";
    import { slide } from "svelte/transition";

  const {socket} = socketService;
  let card: GameMagicCard | GameMinionCard | GameTrapCard;
  $: isSelected = $selectedCardStore.hand && card.gid === $selectedCardStore.hand.gid;

  const onSelectCard = (): void => {
    const {gid, type} = card;

    if ($gameStore.currentPlayer !== $playerStore.name) {
      return;
    }

    if ($selectedCardStore.field !== undefined) {
      $selectedCardStore.field = undefined;
    }

    if (type === CardType.MAGIC) {
      if (card.id === CardId.GRAVECALL) {
        $selectedCardStore.hand = card;
        modalService.open(EffectSelect);
      }

      if (card.id === CardId.CROSS) {
        $selectedCardStore.hand = card;
      }

      if (card.id === CardId.GAMBIT || card.id === CardId.ANVIL || card.id === CardId.PACT) {
        socket.emit("playMagic", {gid});
      }

      if (card.id === CardId.QUICK_SAND) {
        $selectedCardStore.hand = card;
      }
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

<div class="hand-card" >
  <CardComponent {isSelected} {card} on:click="{onSelectCard}"/>
</div>
