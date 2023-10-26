<script lang="ts">
  import {modalService} from "services";
  import {deckStore} from "stores";
  import {CardComponent} from "ui";
  import CardLoreComponent from "./modals/CardLore.svelte";

  let card: any;

  const onAddToDeck = (): void => {
    if ($deckStore.cardsInDeck >= 30) { return; }

    const {id, name, manaCost} = card;

    deckStore.update((store) => {
      const deckCard = store.cards.find((deckCard) => deckCard.id === id);

      if (deckCard) {
        if (deckCard.amount < 2) { deckCard.amount += 1; }
      } else {
        const amount = 1;
        store.cards.push({id, name, amount, manaCost});
      }

      store.cardsInDeck = store.cards.reduce((acc, {amount}) => acc += amount, 0);

      store.cards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  const onViewLore = (): void => {
    modalService.open(CardLoreComponent, card);
  };

  export {card};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click="{onAddToDeck}" on:contextmenu|preventDefault="{onViewLore}">
  <CardComponent {card} health="{0}" damage="{0}"/>
</div>
