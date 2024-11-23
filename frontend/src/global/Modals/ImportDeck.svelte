<script lang="ts">
    import { cards } from "@som/shared/data";
    import { CardKlass, CardType } from "@som/shared/enums";
    import type { PlayerDeck } from "@som/shared/types/mongo";
    import type { PlayerDeckCardView } from "@som/shared/types/views";
  import {formService, modalService, soundService} from "services";
    import { deckCache, notificationsStore, playerStore } from "stores";
  import {FormComponent, FormSubmitComponent, InputComponent, ModalComponent} from "ui";
    import { isDeckSame } from "../../client/DeckBuilder/canSave";

  const formStore = formService.create({
    name: ["", "hash"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  // refactor these, we use these at three different places, maybe put them in
  // the shared module
  const gen = (deck: Array<PlayerDeckCardView>, attr: "health" | "damage" | "manaCost"): number => {
    let totalCards: number
    let totalAttr: number;

    if (attr === "health" || attr === "damage") {
      totalAttr = deck.reduce((acc, deckCard) => {
        if (deckCard.type !== CardType.MINION) {
          return acc;
        } else {
          return acc += deckCard[attr] * deckCard.amount;
        }
      }, 0);

      totalCards = deck.reduce((acc, deckCard) => {
        if (deckCard.type !== CardType.MINION) {
          return acc;
        } else {
          return acc += deckCard.amount;
        }
      }, 0);
    } else {
      totalAttr = deck.reduce((acc, deckCard) => {
        return acc += deckCard[attr] * deckCard.amount;
      }, 0);
      totalCards = deck.reduce((acc, deckCard) => acc += deckCard.amount, 0);
    }

    return totalAttr / totalCards;
  };

  const totalType = (
    deckCardsView: Array<PlayerDeckCardView>,
    type: CardType
  ) => deckCardsView.reduce(
    (acc, deckCard) => deckCard.type !== type ? acc : acc += deckCard.amount
  , 0);

  const totalKlass = (
    deckCardsView: Array<PlayerDeckCardView>,
    klass: CardKlass
  ) => deckCardsView.reduce(
    (acc, deckCard) => deckCard.klass !== klass ? acc : acc += deckCard.amount
  , 0);

  const genDeckCardsView = (deck: PlayerDeck): Array<PlayerDeckCardView> => {
    const mapp = deck.cards.map((deckCard) => {
      const {id, amount} = deckCard;
      const card = cards.find((card): boolean => card.id === id);

      if (!card || card.type === CardType.HERO) {
        return {id, name: "", klass: 0, type: CardType.MINION, damage: 0, health: 0, manaCost: 0, amount: 1};
      }

      const {name} = card;

      if (card.type === CardType.MINION) {
        const {health, damage, klass, type, manaCost} = card;
        return {id, name, klass, type, health, damage, manaCost, amount};
      } else {
        const {klass, type, manaCost} = card;
        return {id, name, klass, type, manaCost, amount};
      }
    });

    return mapp;
  };







  const onSubmit = (): void => {
    soundService.play("click");

    let deck: any;
    let msg = "";

    try {
      deck = JSON.parse(atob($formStore.fields.name.value))
    } catch {
      return notificationsStore.update((store) => {
        store.push({id: Math.random(), color: "warn", message: "Invalid encoding"});
        return store;
      });
    }

    if (deck.name.length >= 12) {
      return notificationsStore.update((store) => {
        store.push({id: Math.random(), color: "warn", message: "Maximum 12 characters length allowed for deck name."});
        return store;
      });
    }

    if (deck.klass < 1 || deck.klass > 4) { // prevent decimals?
      return notificationsStore.update((store) => {
        store.push({id: Math.random(), color: "warn", message: "Invalid class."});
        return store;
      });
    }

    for (const deckCard of deck.cards) {
      const card = cards.find((card): boolean => card.id === deckCard.id);

      if (!card) {
        return notificationsStore.update((store) => {
          store.push({id: Math.random(), color: "warn", message: "One of the cards in your deck is invalid."});
          return store;
        });
      }

      if (card.type === CardType.HERO) {
        return notificationsStore.update((store) => {
          store.push({id: Math.random(), color: "warn", message: "Can't add Hero as a deck card."});
          return store;
        });
      }

      if (deckCard.amount > 2 || deckCard.amount < 1) { // prevent decimals?
        return notificationsStore.update((store) => {
          store.push({id: Math.random(), color: "warn", message: "Invalid amount of cards added."});
          return store;
        });
      }
    }

    const totalCards = deck.cards.reduce((acc: number, {amount}: any) => acc += amount, 0);

    if (totalCards !== 30) {
      return notificationsStore.update((store) => {
        store.push({id: Math.random(), color: "warn", message: "Invalid number of cards, should be 30."});
        return store;
      });
    }

    const deckCardsView = genDeckCardsView(deck);

    $playerStore.decks[$playerStore.deckId] = {
      id: deck.id,
      name: deck.name,
      klass: deck.klass,
      cardsInDeck: deck.cards.reduce((acc: number, {amount}: any) => acc += amount, 0),
      average: {
        health: gen(deckCardsView, "health") || 0,
        damage: gen(deckCardsView, "damage") || 0,
        manaCost: gen(deckCardsView, "manaCost") || 0
      },
      attribute: {
        minion: totalType(deckCardsView, CardType.MINION),
        magic: totalType(deckCardsView, CardType.MAGIC),
        trap: totalType(deckCardsView, CardType.TRAP),
        neutral: totalKlass(deckCardsView, CardKlass.NEUTRAL),
        solid: totalKlass(deckCardsView, CardKlass.SOLID),
        liquid: totalKlass(deckCardsView, CardKlass.LIQUID),
        gas: totalKlass(deckCardsView, CardKlass.GAS),
        plasma: totalKlass(deckCardsView, CardKlass.PLASMA)
      },
      cards: deckCardsView
    };

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    notificationsStore.update((store) => {
      store.push({id: Math.random(), color: "success", message: "Deck imported successfully."});
      return store;
    });

    modalService.close();
  };
</script>

<ModalComponent>

  <svelte:fragment slot="title">Import deck</svelte:fragment>

  <svelte:fragment slot="content">
    <FormComponent on:submit="{onSubmit}">
      <InputComponent
        label="Deck hash"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>
      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>IMPORT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>

</ModalComponent>
