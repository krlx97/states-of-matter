<script lang="ts">
  import {fly, scale} from "svelte/transition";
  import {CardKlass, CardType} from "@som/shared/enums";
  import {soundService} from "services";
  import {playerStore} from "stores";
  import {TextComponent} from "ui";
  import type {PlayerDeckCardView} from "@som/shared/types/views";
    import { cards } from "@som/shared/data";

  let deckCard: PlayerDeckCardView;
  $: deck = $playerStore.decks[$playerStore.deckId];

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

  const spin = (node: any, {duration}: any) => ({
    duration,
    css(t: number) {
      const scale = (t + 0.2) / t;
      // translateX -50% because using only scale would overwrite standard css
      return `transform: translateX(-50%) scale(${scale});`
    }
  });

  const klassColors = new Map([
    [0, "neutral"],
    [1, "solid"],
    [2, "liquid"],
    [3, "gas"],
    [4, "plasma"]
  ]);

  export {deckCard};
</script>

<style>
  .deck-card {
    padding-right: var(--xs);
    display: flex;
    align-items: center;
    gap: var(--xs);
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    border-bottom-left-radius: 48px;
    border-top-left-radius: 48px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: var(--sm);
  }

  .deck-card__img {
    border-radius: 48px;
  }

  .deck-card__name {
    flex-grow: 1;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="deck-card" on:click="{onRemoveFromDeck}">

  <img
    class="deck-card__img"
    src="images/items/sm/1{deckCard.id < 100 ? `0${deckCard.id}` : deckCard.id}00.png"
    alt="{deckCard.name}" height="32" width="32"/>

  <div class="deck-card__name">
    <TextComponent color="{klassColors.get(deckCard.klass) || "common"}">
      {deckCard.name}
    </TextComponent>
    <br/>
    <div style="color: white; display: flex; gap: 4px">
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
