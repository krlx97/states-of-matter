<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {modalService, socketService, soundService} from "services";
  import {deckCache, playerStore} from "stores";
  import {ButtonComponent, LinkComponent, MenuComponent, ProgressBarComponent, TextComponent} from "ui";
  import ChangeDeckNameComponent from "./modals/ChangeDeckName.svelte";
  import { CardType } from "@som/shared/enums";
  import { canSave, isDeckSame } from "./canSave";

  let isMenuVisible = false;
  let currentSort = "Initial";
  let sortAscending = true;

  const dispatch = createEventDispatcher();

  const selectedIcon = new Map([
    [1, 10500],
    [2, 11000],
    [3, 11500],
    [4, 12000],
  ]);
  $: deck = $playerStore.decks[$playerStore.deckId];
  $: disabledRevert = isDeckSame($deckCache, deck, true);

  $: bars = [{
    color: "white",
    progress: $playerStore.decks[$playerStore.deckId].attribute.neutral / 30 * 100,
    val: $playerStore.decks[$playerStore.deckId].attribute.neutral
  }, {
    color: "red",
    progress: $playerStore.decks[$playerStore.deckId].attribute.solid / 30 * 100,
    val: $playerStore.decks[$playerStore.deckId].attribute.solid
  }, {
    color: "blue",
    progress: $playerStore.decks[$playerStore.deckId].attribute.liquid / 30 * 100,
    val: $playerStore.decks[$playerStore.deckId].attribute.liquid
  }, {
    color: "green",
    progress: $playerStore.decks[$playerStore.deckId].attribute.gas / 30 * 100,
    val: $playerStore.decks[$playerStore.deckId].attribute.gas
  }, {
    color: "plasma",
    progress: $playerStore.decks[$playerStore.deckId].attribute.plasma / 30 * 100,
    val: $playerStore.decks[$playerStore.deckId].attribute.plasma
  }];

  const klassColors = new Map([
    [0, "neutral"],
    [1, "solid"],
    [2, "liquid"],
    [3, "gas"],
    [4, "plasma"]
  ]);

  const clearDeck = (): void => {
    $playerStore.decks[$playerStore.deckId].cards = [];
    $playerStore.decks[$playerStore.deckId].cardsInDeck = 0;
    $playerStore.decks[$playerStore.deckId].attribute.neutral = 0;
    $playerStore.decks[$playerStore.deckId].attribute.solid = 0;
    $playerStore.decks[$playerStore.deckId].attribute.liquid = 0;
    $playerStore.decks[$playerStore.deckId].attribute.gas = 0;
    $playerStore.decks[$playerStore.deckId].attribute.plasma = 0;
    $playerStore.decks[$playerStore.deckId].attribute.magic = 0;
    $playerStore.decks[$playerStore.deckId].attribute.minion = 0;
    $playerStore.decks[$playerStore.deckId].attribute.trap = 0;
    $playerStore.decks[$playerStore.deckId].average.damage = 0;
    $playerStore.decks[$playerStore.deckId].average.manaCost = 0;
    $playerStore.decks[$playerStore.deckId].average.health = 0;
    soundService.play("click");
    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    isMenuVisible = false;
  };

  const changeDeckName = (): void => {
    modalService.open(ChangeDeckNameComponent);
    soundService.play("click");
    isMenuVisible = false;
  };

  const revertDeck = (): void => {
    playerStore.update((store) => {
      store.decks[store.deckId] = JSON.parse(JSON.stringify($deckCache));
      return store;
    });

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);
  };

  const saveDeck = (): void => {
    const {id, name, klass} = $playerStore.decks[$playerStore.deckId];
    const cards = $playerStore.decks[$playerStore.deckId].cards.map(({id, amount}) => ({id, amount}));
    const deck = {id, name, klass, cards};

    socketService.socket.emit("saveDeck", {deck});
    soundService.play("click");
    isMenuVisible = false;
  };

  const switchDeck = (): void => {
    dispatch("toggleDeckSlots");
    soundService.play("click");
    isMenuVisible = false;
  };

  const onSortDamage = (): void => {
    if (currentSort === "Damage") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Damage";
    }

    $playerStore.decks[$playerStore.deckId].cards = $playerStore.decks[$playerStore.deckId].cards.sort((a, b) => {
      if (a.type === CardType.MINION && b.type !== CardType.MINION) {
        return -1; // Minions always come before magic/trap cards
      } else if (a.type !== CardType.MINION && b.type === CardType.MINION) {
        return 1; // Magic/trap cards always come after minions
      } else if (a.type === CardType.MINION && b.type === CardType.MINION) {
        // Both are minions, sort based on damage
        return sortAscending ? a.damage - b.damage : b.damage - a.damage;
      } else {
        return 0; // Cards other than minions are considered equal in terms of sorting
      }
    });

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    soundService.play("click");
  };

  const onSortManaCost = (): void => {
    if (currentSort === "Mana Cost") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Mana Cost";
    }

    $playerStore.decks[$playerStore.deckId].cards = $playerStore.decks[$playerStore.deckId].cards.sort((a, b) => {
      if (a.type !== CardType.HERO && b.type !== CardType.HERO) {
        return sortAscending ? a.manaCost - b.manaCost : b.manaCost - a.manaCost;
      } else {
        return 0;
      }
    });

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    soundService.play("click");
  };

  const onSortHealth = (): void => {
    if (currentSort === "Health") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Health";
    }

    $playerStore.decks[$playerStore.deckId].cards = $playerStore.decks[$playerStore.deckId].cards.sort((a, b) => {
      if (a.type === CardType.MINION && b.type !== CardType.MINION) {
        return -1; // Minions always come before magic/trap cards
      } else if (a.type !== CardType.MINION && b.type === CardType.MINION) {
        return 1; // Magic/trap cards always come after minions
      } else if (a.type === CardType.MINION && b.type === CardType.MINION) {
        // Both are minions, sort based on health
        return sortAscending ? a.health - b.health : b.health - a.health;
      } else {
        return 0; // Cards other than minions are considered equal in terms of sorting
      }
    });

    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    soundService.play("click");
  };
</script>

<style>
  .selected-deck {
    padding: var(--sm);
    /* padding-bottom: var(--xl); */
    display: flex;
    align-items: center;
    gap: var(--sm);
    /* background-color: rgba(var(--dark-grey), var(--opacity-sm));
    backdrop-filter: blur(var(--md)); */
    /* border: 1px solid rgba(var(--grey), var(--opacity-sm)); */
    /* border: 0 solid; */
    border-radius: 8px;
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey)) 0%,
      rgba(var(--grey), 0.3333) 50%,
      rgb(var(--dark-grey)) 100%
    ) 1;
    font-size: var(--sm);
  }

  .selected-deck__attrs {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-deck__main {
    font-size: var(--sm);
    display: flex;
    align-items: center;
    gap: var(--sm);
  }

  .selected-deck__img {
    margin-right: var(--md);
    display: flex;
    align-items: center;
  }

  .selected-deck__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-deck__main__title {
    /* flex-grow: 1; */
    /* width: 100%; */
 
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .selected-deck__info__actions {
    display: flex;
    justify-content: center;
    gap: var(--sm);
  }

  .deck__stats {
    /* margin-top: var(--md); */
    display: flex;
    gap: var(--xs);
    /* align-items: center;
    justify-content: space-evenly; */
    /* font-size: var(--font-xs); */
  }

  .deck__stat {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
  }

  .imgg {border-radius: 50%}

  .selected-deck__imgg {
    position: relative;
  }

  .abs {
    position: absolute;
    bottom: 0px;
    left: 0px;
    /* background-color: rgb(var(--dark-grey)); */
  }
</style>

<div class="selected-deck">

  <div class="selected-deck__imgg">
    <img class="imgg" src="images/items/sm/{selectedIcon.get(deck.klass)}.png" alt="Hero" height="48" width="48"/>
    <!-- <div class="abs">
      <ButtonComponent isIcon on:click={() => {
        isMenuVisible = !isMenuVisible;
        soundService.play("click");
      }}>
        <i class="fa-solid fa-{isMenuVisible ? "times" : "bars"}"></i>
      </ButtonComponent>
    </div>
    {#if isMenuVisible}
      <MenuComponent items={[
        ["Clear", clearDeck],
        ["Rename", changeDeckName],
        ["Save", saveDeck],
        ["Switch", switchDeck]
      ]}/>
    {/if} -->
  </div>

  <div class="selected-deck__attrs">

    <div style="display: flex; justify-content: space-between; line-height: 1.25;;">
      <div class="selected-deck__main__title">
        <TextComponent color="{klassColors.get(deck.klass) || "common"}">
          {deck.name}
        </TextComponent>
        <br/>
        {deck.cardsInDeck} / 30
      </div>

      <div class="selected-deck__main__title">
        <div class="deck__stats">
          <LinkComponent color="damage" on:click="{onSortDamage}">
            {deck.average.damage.toFixed(2)}
            {#if currentSort === "Damage"}
              <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
            {/if}
          </LinkComponent>
          <LinkComponent color="mana" on:click="{onSortManaCost}">
            {deck.average.manaCost.toFixed(2)}
            {#if currentSort === "Mana Cost"}
              <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
            {/if}
          </LinkComponent>
          <LinkComponent color="health" on:click="{onSortHealth}">
            {deck.average.health.toFixed(2)}
            {#if currentSort === "Health"}
              <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
            {/if}
          </LinkComponent>
        </div>

        <div class="deck__stats">
          <div class="deck__stat">
            <img src="images/card/minion.png" height="16" width="16"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.minion}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/magic.png" height="16" width="16"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.magic}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/trap.png" height="16" width="16"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.trap}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProgressBarComponent {bars}/>

    <div style="display: flex; justify-content: space-evenly; margin-top: 4px;">
      <ButtonComponent isIcon disabled="{!$canSave || $playerStore.decks[$playerStore.deckId].cardsInDeck !== 30}" on:click="{saveDeck}">
        <TextComponent color="{!$canSave || $playerStore.decks[$playerStore.deckId].cardsInDeck !== 30 ? "grey" : "success"}"><i class="fa-solid fa-floppy-disk"></i></TextComponent>
      </ButtonComponent>
      <ButtonComponent isIcon disabled={!disabledRevert} on:click="{revertDeck}">
        <TextComponent color="{!disabledRevert ? "grey" : "white"}"><i class="fa-solid fa-clock-rotate-left"></i></TextComponent>
      </ButtonComponent>
      <ButtonComponent isIcon on:click="{clearDeck}"><i class="fa-solid fa-trash"></i></ButtonComponent>
      <ButtonComponent isIcon on:click="{switchDeck}"><i class="fa-solid fa-repeat"></i></ButtonComponent>
      <ButtonComponent isIcon on:click="{changeDeckName}"><i class="fa-solid fa-pen"></i></ButtonComponent>
    </div>
  </div>

</div>
