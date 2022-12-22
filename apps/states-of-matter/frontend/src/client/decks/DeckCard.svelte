<script lang="ts">
  import {decksStore, playerStore} from "stores";

  let card: any;

  const onRemoveFromDeck = (): void => {
    const {deckId} = $playerStore;

    decksStore.update((store) => {
      const deckCard = store.deckCards.find((deckCard) => deckCard.id === card.id);
      const deckSlot = store.deckSlots.find((deckSlot) => deckSlot.id === deckId);

      if (deckCard.amount > 1) {
        deckCard.amount -= 1;
      } else {
        const i = store.deckCards.indexOf(deckCard);
        store.deckCards.splice(i, 1);
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);

      store.deckCards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  export {card};
</script>

<style>
  .card {
    margin-bottom: var(--spacing-md);
    padding: 0px var(--spacing-md);
    display: flex;
    align-items: center;
    /* background-color: rgb(var(--dark-grey)); */
    /* border: 2px solid rgb(var(--light-grey)); */
    box-sizing: border-box;
    cursor: pointer;
    line-height: 1.4;
    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    
    
    /* border-width: 3px; */
    border-style: solid;
    /* border-color: white; */
    border-image: linear-gradient(90deg, rgba(63,63,63,1) 0%, rgba(255,255,255,1) 50%, rgba(63,63,63,1) 100%) 1 stretch;
    /* border-image: linear-gradient(270deg, rgba(200,200,200,1) 0%, rgba(255,255,255,1) 50%, rgba(200,200,200,1) 100%) 2 100%; */
  }

  .card:last-child {
    margin-bottom: 0;
  }

  .card__img {
    /* height: 48px;
    width: 48px; */
    /* margin-right: var(spacing-md); */
    border-radius: 50%;
    display: block;
    /* box-shadow: var(--elevation-md); */
  }

  .card__text {
    flex-grow: 1;
  }

  .card__attr {
    height: 100%;
    line-height: 1;
    /* margin-right: var(--spacing-sm); */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__attr img {
    margin-bottom: 4px;
  }
</style>

<div class="card" on:click={onRemoveFromDeck} on:keypress={onRemoveFromDeck}>
  <div style="margin-right: 0.5em">
    <img class="card__img" src="assets/cards/sm/{card.id}.jpg" alt={card.name}/>
  </div>
  <div class="card__text">
    <div>{card.name}</div>
    <div>{card.amount} / 2</div>
  </div>
  <div class="card__attr">
    <img src="assets/attrs/manacost.png" alt="Mana cost"/>
    <div>{card.manaCost}</div>
  </div>
</div>
