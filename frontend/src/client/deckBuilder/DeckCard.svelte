<script lang="ts">
  import {deckStore} from "stores";

  let card: any;

  const onRemoveFromDeck = (): void => {
    deckStore.update((store) => {
      const deckCard = store.cards.find((deckCard) => deckCard.id === card.id);

      if (deckCard.amount > 1) {
        deckCard.amount -= 1;
      } else {
        const i = store.cards.indexOf(deckCard);
        store.cards.splice(i, 1);
      }

      store.cardsInDeck = store.cards.reduce((acc, {amount}) => acc += amount, 0);

      store.cards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  export {card};
</script>

<style>
  .deck-card {
    width: 100%;
    padding: 0 var(--spacing-md);
    display: flex;
    align-items: center;
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    box-sizing: border-box;
    cursor: pointer;
  }

  .deck-card__img {
    margin-right: var(--spacing-md);
    border-radius: 50%;
  }

  .deck-card__info {
    flex-grow: 1;
    line-height: 1.4;
  }

  .deck-card__attr {
    position: relative;
  }

  .deck-card__attr__num {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }
</style>

<div
  class="deck-card"
  on:click={onRemoveFromDeck}
  on:keypress={onRemoveFromDeck}
>
  <img
    class="deck-card__img"
    src="assets/cards/sm/{card.id}.jpg"
    alt={card.name}
  />
  <div class="deck-card__info">
    <div>{card.name}</div>
    <div>{card.amount} / 2</div>
  </div>
  <div class="deck-card__attr">
    <img src="assets/attrs/manacost.png" alt="Mana cost"/>
    <div class="deck-card__attr__num">{card.manaCost}</div>
  </div>
</div>
