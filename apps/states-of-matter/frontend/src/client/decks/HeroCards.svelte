<script lang="ts">
  import {cards} from "@som/shared/data";
  import {socketService} from "services";
  import {playerStore} from "stores";
  import {CardType, type CardKlass} from "@som/shared/enums";
  import Card from "../../ui/Card.svelte";

  const setDeckKlass = (klass: CardKlass): void => {
    const {deckId} = $playerStore;
    socketService.socket.emit("setDeckKlass", {deckId, klass});
  };
</script>

<style>
  .heroes {
    display: flex;
    padding: 1em;
  }

  .heroes__hero {
    margin-right: var(--spacing-md);
  }

  .heroes__hero:last-child {
    margin-right: 0;
  }
</style>

<div class="heroes">
  {#each cards as card}
    {#if card.type === CardType.HERO}
      <div
        class="heroes__hero"
        on:click={() => setDeckKlass(card.klass)}
        on:keypress={() => setDeckKlass(card.klass)}
      >
        <Card {card} health={0} mana={0}/>
      </div>
    {/if}
  {/each}
</div>
