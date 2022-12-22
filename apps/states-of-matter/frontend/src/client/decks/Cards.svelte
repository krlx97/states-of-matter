<script lang="ts">
  import {cards} from "@som/shared/data";
  import {CardType} from "@som/shared/enums";
  import {miscService} from "services";
  import {decksStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";

  let selectedKlass = 0;
  const klasses = [0, 1, 2, 3, 4];

  const onAddToDeck = (card: any): void => {
    const {id, klass, name, manaCost} = card;
    const {deckId} = $playerStore;
    const deckSlot = $decksStore.deckSlots.find((deckSlot) => deckSlot.id === deckId);

    if (deckSlot.cardsInDeck >= 30) { return; }

    decksStore.update((store) => {
      const deckCard = store.deckCards.find((deckCard) => deckCard.id === id);
      const deckSlot = store.deckSlots.find((deckSlot) => deckSlot.id === deckId);

      if (deckCard) {
        if (deckCard.amount < 2) { deckCard.amount += 1; }
      } else {
        const amount = 1;
        store.deckCards.push({klass, id, name, amount, manaCost});
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);

      store.deckCards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  const onViewLore = (card: any): void => {
    miscService.openModal("cardLore", card);
  };
</script>

<style>
  .cards {
    display: flex;
    flex-direction: column;
  }

  .cards__klasses {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1em;
  }
  .cards__klasses__klass {
    display: flex;
    opacity: 0.5;
    cursor: pointer;
    transition: filter 225ms ease;
    border-radius: 50%;
    box-shadow: none;
  }
  .cards__klasses__klass:hover {
    opacity: 1;
    box-shadow: 0 0 8px 2px white;
  }
  .cards__klasses__klass-selected {
    opacity: 1;
    box-shadow: 0 0 8px 2px white;
  }

  .cards__list {
    height: calc(216px * 2 + var(--spacing-md) * 3);
    padding: var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--spacing-md);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .cards__list::-webkit-scrollbar {
    width: 8px;
  }
  .cards__list::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }
  .cards__list::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }
</style>

<div class="cards">
  <div class="cards__klasses">
    {#each klasses as klass}
      <div
        class="cards__klasses__klass"
        class:cards__klasses__klass-selected={klass === selectedKlass}
        on:click={() => selectedKlass = klass}
        on:keypress={() => selectedKlass = klass}
      >
        <img src="assets/classes/48/{klass}.png" alt="Klass {klass}"/>
      </div>
    {/each}
  </div>
  <div class="cards__list">
    {#each cards as card}
      {#if card.klass === selectedKlass && card.type !== CardType.HERO}
        <div
          on:click={() => onAddToDeck(card)}
          on:keypress={() => onAddToDeck(card)}
          on:contextmenu|preventDefault={() => onViewLore(card)}
        >
          <Card {card} health={0} damage={0}/>
        </div>
      {/if}
    {/each}
  </div>
</div>
