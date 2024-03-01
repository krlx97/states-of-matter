<script lang="ts">
  import {CardId, CardType} from "@som/shared/enums";
  import {modalService, socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {CardComponent} from "ui";
  import EffectSelect from "../modals/EffectSelect.svelte";
  import type {GameMagicCard, GameMinionCard, GameTrapCard} from "@som/shared/types/mongo";

  const {socket} = socketService;
  let card: GameMagicCard | GameMinionCard | GameTrapCard;

  $: isSelected = $selectedCardStore.hand && card.gid === $selectedCardStore.hand.gid;
  $: isGrayscale = card.manaCost.current > $gameStore.player.field.hero.mana.current;

  const onSelectCard = (): void => {
    const {gid, type} = card;

    if ($gameStore.currentPlayer !== $playerStore.name) {
      return;
    }

    if (isGrayscale) {
      return;
    }

    if ($selectedCardStore.field !== undefined) {
      $selectedCardStore.field = undefined;
    }

    if ($selectedCardStore.hand && $selectedCardStore.hand.gid === card.gid) {
      $selectedCardStore.hand = undefined;
    } else {
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
        $selectedCardStore.hand = card;
      } else if (type === CardType.TRAP) {
        socket.emit("playTrap", {gid});
      }
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
  <CardComponent {isGrayscale} {isSelected} {card} on:click="{onSelectCard}"/>
</div>
