<script lang="ts">
  import {decksStore} from "stores";
  import DeckCard from "./DeckCard.svelte";
</script>

<style>
  .deck-cards {
    height: calc(843px - 96px - 5em);
    width: 256px;
    padding: var(--spacing-md);
    padding-left: 0;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .deck-cards::-webkit-scrollbar {
    width: 8px;
  }
  .deck-cards::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }
  .deck-cards::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }
</style>

<div class="deck-cards">
  {#if $decksStore.deckCards.length}
    {#each $decksStore.deckCards as card}
      <DeckCard {card}/>
    {/each}
  {:else}
    Your deck is empty...
    <hr/>
    --- Tutorial ---
    <br/>
    There are 5 Card classes in States of Matter: Neutral, Solid, Liquid, Gas
    and Plasma, and 4 Card types: Hero, Minion, Magic, and Trap. Your deck
    consists of only 1 Hero and any 30 - up to two of each - Magic, Minion or
    Trap cards.
    <hr/>
    Hero will always persist on the Game field
    and the Game is concluded when one of the Player Heroes dies, or when players can't draw any more cards from the deck.
    Minions can attack other minions or Hero, magic cards add buffs / debuffs to other cards,
    and trap cards are triggered only when their effect conditions are met.
    <hr/>
    Click on the Hero to select them, and click on other Cards to add them to
    the deck.
    You can right click on the card to preview it's lore and available skins.
    Selecting a different skin will change the artwork of the card and might
    change the lore, but will not give any game advantages. You can own multiple
    serials of the same skin, however you can only select one at a time.
  {/if}
</div>
