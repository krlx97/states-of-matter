<script lang="ts">
  import {fly, scale} from "svelte/transition";
  import {CardId, CardKlass, CardType} from "@som/shared/enums";
  import {soundService} from "services";
  import {notificationsStore, playerStore} from "stores";
  import {TextComponent} from "ui";
  import type {PlayerDeckCardView} from "@som/shared/types/views";
    import { cards, cardsView } from "@som/shared/data";
    import { onMount } from "svelte";

  let deckCard: PlayerDeckCardView;
  $: deck = $playerStore.decks[$playerStore.deckId];
  let cardView = cardsView.find(({id}): boolean => deckCard.id === id);

  const onRemoveFromDeck = (): void => {
    const x = $playerStore.decks[$playerStore.deckId].cards.find((x) => x.id === deckCard.id);

    if (!x) { return; }

    const {type, klass} = x;

    if (deckCard.amount > 1) {
      x.amount -= 1;
    } else {
      const i = $playerStore.decks[$playerStore.deckId].cards.indexOf(x);
      $playerStore.decks[$playerStore.deckId].cards.splice(i, 1);
    }

    $playerStore.decks[$playerStore.deckId].cardsInDeck = $playerStore.decks[$playerStore.deckId].cards.reduce((acc, {amount}) => acc += amount, 0);

    $playerStore.decks[$playerStore.deckId].average.health = deck.cards.reduce((acc, deckCard) => {
      if (
        deckCard.type === CardType.MAGIC ||
        deckCard.type === CardType.TRAP
      ) {
        return acc;
      }

      return acc += deckCard.health * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => {
      if (deckCard.type !== CardType.MINION) {
        return acc;
      } else {
        return acc += deckCard.amount;
      }
    }, 0) || 0;

    $playerStore.decks[$playerStore.deckId].average.damage = deck.cards.reduce((acc, deckCard) => {
      const card = cards.find((card): boolean => deckCard.id === card.id);

      if (
        !card ||
        card.type === CardType.HERO ||
        card.type === CardType.MAGIC ||
        card.type === CardType.TRAP
      ) {
        return acc;
      }

      return acc += card.damage * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => {
      if (deckCard.type !== CardType.MINION) {
        return acc;
      } else {
        return acc += deckCard.amount;
      }
    }, 0) || 0;

    $playerStore.decks[$playerStore.deckId].average.manaCost = deck.cards.reduce((acc, deckCard) => {
      const card = cards.find((card): boolean => deckCard.id === card.id);

      if (!card || card.type === CardType.HERO) {
        return acc;
      }

      return acc += card.manaCost * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0;

    if (type === CardType.MINION) {
      $playerStore.decks[$playerStore.deckId].attribute.minion -= 1;
    } else if (type === CardType.MAGIC) {
      $playerStore.decks[$playerStore.deckId].attribute.magic -= 1;
    } else if (type === CardType.TRAP) {
      $playerStore.decks[$playerStore.deckId].attribute.trap -= 1;
    }

    if (klass === CardKlass.NEUTRAL) {
      $playerStore.decks[$playerStore.deckId].attribute.neutral -= 1;
    } else if (klass === CardKlass.SOLID) {
      $playerStore.decks[$playerStore.deckId].attribute.solid -= 1;
    } else if (klass === CardKlass.LIQUID) {
      $playerStore.decks[$playerStore.deckId].attribute.liquid -= 1;
    } else if (klass === CardKlass.GAS) {
      $playerStore.decks[$playerStore.deckId].attribute.gas -= 1;
    } else if (klass === CardKlass.PLASMA) {
      $playerStore.decks[$playerStore.deckId].attribute.plasma -= 1;
    }

    soundService.play("card");
  };

  const onAddToDeck = (): void => {
    if (deck.cardsInDeck >= 30) {
      return soundService.play("TAB");
    }

    const {id, klass, type, manaCost} = deckCard;
    // const deckCard = $playerStore.decks[$playerStore.deckId].cards.find((deckCard): boolean => deckCard.id === id);
    // const cardView = cardsView.find(({id}): boolean => deckCard.id === id);

    if (!cardView) { return; }

    const {name} = cardView;

    if (deckCard) {
      if (deckCard.amount < 2) {
        deckCard.amount += 1;
      } else {
        return soundService.play("TAB");
      }
    } else {
      const amount = 1;
      if (type === CardType.MINION) {
        const {health, damage} = deckCard;
        $playerStore.decks[$playerStore.deckId].cards.push({id, type, name, klass, amount, health, damage, manaCost});
      } else {
        $playerStore.decks[$playerStore.deckId].cards.push({id, type, name, klass, amount, manaCost});
      }
    }

    $playerStore.decks[$playerStore.deckId].average.health = deck.cards.reduce((acc, deckCard) => {
      if (
        deckCard.type === CardType.MAGIC ||
        deckCard.type === CardType.TRAP
      ) {
        return acc;
      }

      return acc += deckCard.health * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => {
      if (deckCard.type !== CardType.MINION) {
        return acc;
      } else {
        return acc += deckCard.amount;
      }
    }, 0) || 0;

    $playerStore.decks[$playerStore.deckId].average.damage = deck.cards.reduce((acc, deckCard) => {
      const card = cards.find((card): boolean => deckCard.id === card.id);

      if (
        !card ||
        card.type === CardType.HERO ||
        card.type === CardType.MAGIC ||
        card.type === CardType.TRAP
      ) {
        return acc;
      }

      return acc += card.damage * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => {
      if (deckCard.type !== CardType.MINION) {
        return acc;
      } else {
        return acc += deckCard.amount;
      }
    }, 0) || 0;

    $playerStore.decks[$playerStore.deckId].average.manaCost = deck.cards.reduce((acc, deckCard) => {
      const card = cards.find((card): boolean => deckCard.id === card.id);

      if (!card || card.type === CardType.HERO) {
        return acc;
      }

      return acc += card.manaCost * deckCard.amount;
    }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0;

    if (type === CardType.MINION) {
      $playerStore.decks[$playerStore.deckId].attribute.minion += 1;
    } else if (type === CardType.MAGIC) {
      $playerStore.decks[$playerStore.deckId].attribute.magic += 1;
    } else if (type === CardType.TRAP) {
      $playerStore.decks[$playerStore.deckId].attribute.trap += 1;
    }

    if (klass === CardKlass.NEUTRAL) {
      $playerStore.decks[$playerStore.deckId].attribute.neutral += 1;
    } else if (klass === CardKlass.SOLID) {
      $playerStore.decks[$playerStore.deckId].attribute.solid += 1;
    } else if (klass === CardKlass.LIQUID) {
      $playerStore.decks[$playerStore.deckId].attribute.liquid += 1;
    } else if (klass === CardKlass.GAS) {
      $playerStore.decks[$playerStore.deckId].attribute.gas += 1;
    } else if (klass === CardKlass.PLASMA) {
      $playerStore.decks[$playerStore.deckId].attribute.plasma += 1;
    }

    $playerStore.decks[$playerStore.deckId].cardsInDeck = $playerStore.decks[$playerStore.deckId].cards.reduce((acc, {amount}) => acc += amount, 0);

    // if (deckCard?.amount >= 2) {
    //   isGrayscale = true;
    // }
    // const has = $playerStore.decks[$playerStore.deckId].cards.find((deckCard) => deckCard.id === card.id);
    // if (has && has.amount === 2) {
    //   isGrayscale = true;
    // }
    soundService.play("card");
  };

  const klassColors = new Map([
    [0, "neutral"],
    [1, "solid"],
    [2, "liquid"],
    [3, "gas"],
    [4, "plasma"]
  ]);

  onMount((): void => {
    cardView = cardsView.find(({id}): boolean => deckCard.id === id);
  });

  export {deckCard};
</script>

<style>
  .deck-card {
    position: relative;
    padding-right: var(--xs);
    display: flex;
    align-items: center;
    gap: var(--xs);
    background-color: rgba(var(--dark-grey), var(--opacity-sm));
    backdrop-filter: blur(var(--md));
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    border-bottom-left-radius: 32px;
    border-top-left-radius: 32px;
    box-sizing: border-box;
    font-size: var(--sm);
    transition: border-color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  .deck-card:hover {
    cursor: pointer;
    border-color: rgba(var(--white), var(--opacity-full));
  }

  .deck-card__img {
    border-radius: 32px;
  }

  .deck-card__name {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .deck-card__tooltip {
    padding: 4px;
    position: absolute;
    /* top: 0; */
    top: calc(100%);
    left: 0;
    width: 100%;
    /* height: 100%; */
    display: none;
    box-sizing: border-box;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 4px;
    /* border-bottom-left-radius: 32px;
    border-top-left-radius: 32px; */
    font-size: var(--xs);
    z-index: 100;
  }

  .deck-card:hover .deck-card__tooltip {
    display: initial;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="deck-card" on:click="{onRemoveFromDeck}" on:contextmenu|preventDefault="{onAddToDeck}">

  <!-- <div class="deck-card__tooltip">
    {#each cardView.effect.description as chunk}
      {#if typeof chunk === "string"}
        {chunk}
      {:else}
        <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
      {/if}
    {/each}
  </div> -->

  <img
    class="deck-card__img"
    src="images/items/sm/1{deckCard.id < 100 ? `0${deckCard.id}` : deckCard.id}00.png"
    alt="{deckCard.name}" height="32" width="32"/>

  <div class="deck-card__name">
    <TextComponent color="{klassColors.get(deckCard.klass) || "common"}">
      {deckCard.name}
    </TextComponent>
    <div>
      {deckCard.amount} / 2
    </div>
  </div>

  <div>
    {#if deckCard.type === CardType.MINION}
      <TextComponent color="damage">{deckCard.damage}</TextComponent>
    {/if}
    <TextComponent color="mana">{deckCard.manaCost}</TextComponent>
    {#if deckCard.type === CardType.MINION}
      <TextComponent color="health">{deckCard.health}</TextComponent>
    {/if}
  </div>

  {#if deckCard.type === CardType.MINION}
    <img src="images/card/minion.png" alt="Minion"/>
  {:else if deckCard.type === CardType.MAGIC}
    <img src="images/card/magic.png" alt="Magic"/>
  {:else}
    <img src="images/card/trap.png" alt="Trap"/>
  {/if}

</div>
