<script lang="ts">
  import {modalService} from "services";
  import {gameStore, selectedCardStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
  import type {GameCard} from "@som/shared/types/mongo";
  import { CardType } from "@som/shared/enums";

  const onSelect = (card: GameCard): void => {
    $selectedCardStore.graveyard = card;
    modalService.close();
  };
</script>

<style>
  .cards {
     width: calc(148px * 4 + var(--md) * 3);
    padding-bottom: var(--md);
    display: flex;
    gap: var(--md);
    overflow-x: scroll;
  }
 .cards::-webkit-scrollbar {
    height: 4px;
  }

  .cards::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .cards::-webkit-scrollbar-thumb {
    background-color: rgb(var(--dark-grey));
    border: 2px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>

<ModalComponent width="664px">
  <div class="cards">
    {#each $gameStore.player.graveyard as card}
      {#if card.type === CardType.MINION}
        <div>
          <CardComponent {card} on:click="{() => onSelect(card)}"/>
        </div>
      {/if}
    {/each}
  </div>
</ModalComponent>
