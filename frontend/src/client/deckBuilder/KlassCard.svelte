<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {cards, cardsView} from "@som/shared/data";
  import {CardId, CardKlass, CardType} from "@som/shared/enums";
  import {modalService, soundService} from "services";
  import {deckCache, notificationsStore, playerStore} from "stores";
  import {ClientCardComponent} from "ui";
  import CardLoreComponent from "./modals/CardLore.svelte";
  import {get, type Unsubscriber} from "svelte/store";
    import { isDeckSame } from "./canSave";
    import type { PlayerDeckView } from "@som/shared/types/views";

  let card: any;
  let isGrayscale = false;
  $: deck = $playerStore.decks[$playerStore.deckId];


  const onAddToDeck = (): void => {
    
    if (deck.cardsInDeck >= 30) {
      return soundService.play("TAB");
    }

    if (card.id === CardId.FURY) {
      notificationsStore.update((store) => {
        const id = Math.random();
        store.push({id, color: "warn", message: "Fury is temporarily disabled due to a game breaking bug..."});
        return store;
      });

      return soundService.play("TAB");
    }

    if (
      card.klass === CardKlass.LIQUID ||
      card.klass === CardKlass.GAS ||
      card.klass === CardKlass.PLASMA
    ) {
      notificationsStore.update((store) => {
        const id = Math.random();
        store.push({id, color: "warn", message: "Can't add to deck, card is still in development..."});
        return store;
      });

      return soundService.play("TAB");
    }

    const {id, klass, type, manaCost} = card;
    const deckCard = $playerStore.decks[$playerStore.deckId].cards.find((deckCard): boolean => deckCard.id === id);
    const cardView = cardsView.find(({id}): boolean => card.id === id);

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
        const {health, damage} = card;
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

    if (deckCard?.amount >= 2) {
      isGrayscale = true;
    }

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    soundService.play("card");
  };

  const onViewLore = (): void => {
    modalService.open(CardLoreComponent, card);
    soundService.play("click");
  };

  let sub: Unsubscriber;

  onMount((): void => {
    const has = $playerStore.decks[$playerStore.deckId].cards.find((deckCard) => deckCard.id === card.id);
    if (has && has.amount === 2) {
      isGrayscale = true;
    }

    sub = playerStore.subscribe((store): void => {
      const deckCard = store.decks[store.deckId].cards.find((deckCard) => deckCard.id === card.id)

      if (deckCard && deckCard.amount >= 2) {
        isGrayscale = true;
      } else {
        isGrayscale = false;
      }
    })
  });

  onDestroy(() => {sub()});

  export {card};
</script>

{#key $playerStore}
  <ClientCardComponent
    {isGrayscale}
    {card}
    isGlowing="{deck.klass === card.klass}"
    on:click="{onAddToDeck}"
    on:contextmenu="{onViewLore}"/>
{/key}
