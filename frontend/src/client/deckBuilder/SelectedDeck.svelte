<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {modalService, socketService, soundService} from "services";
  import {playerStore} from "stores";
  import {ButtonComponent, LinkComponent, MenuComponent, ProgressBarComponent, TextComponent} from "ui";
  import ChangeDeckNameComponent from "./modals/ChangeDeckName.svelte";
    import { CardType } from "@som/shared/enums";

  let isMenuVisible = false;
  let currentSort = "Initial";
  let sortAscending = true;
  const dispatch = createEventDispatcher();
  $: deck = $playerStore.decks[$playerStore.deckId];

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
    isMenuVisible = false;
  };

  const changeDeckName = (): void => {
    modalService.open(ChangeDeckNameComponent);
    soundService.play("click");
    isMenuVisible = false;
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
      if (a.type === CardType.MINION && b.type === CardType.MINION) {
        return sortAscending ? a.damage - b.damage : b.damage - a.damage;
      } else if (a.type === CardType.MINION && b.type !== CardType.MINION) {
        return 1;
      } else if (a.type !== CardType.MINION && b.type === CardType.MINION) {
        return -1
      } else {
        return 0;
      }
    });

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

    soundService.play("click");
  };

  const selectedIcon = new Map([
    [1, 105000],
    [2, 110000],
    [3, 115000],
    [4, 120000],
  ]);

  const onSortHealth = (): void => {
    if (currentSort === "Health") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Health";
    }

    $playerStore.decks[$playerStore.deckId].cards = $playerStore.decks[$playerStore.deckId].cards.sort((a, b) => {
      if (a.type === CardType.MINION && b.type === CardType.MINION) {
        return sortAscending ? a.health - b.health : b.health - a.health;
      } else if (a.type === CardType.MINION && b.type !== CardType.MINION) {
        return 1;
      } else if (a.type !== CardType.MINION && b.type === CardType.MINION) {
        return -1;
      } else {
        return 0;
      }
    });

    soundService.play("click");
  };
</script>

<style>
  .selected-deck {
    padding: var(--sm);
    display: flex;
    align-items: center;
    gap: var(--sm);
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
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
    /* display: flex;
    justify-content: space-between; */
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
    bottom: -4px;
    left: -12px;
    /* background-color: rgb(var(--dark-grey)); */
  }


  .bar {
    display: inline-block;
    cursor: pointer;
    animation: breathe 900ms linear infinite alternate;
  }

  @keyframes breathe {
    from {transform: scale(1);}
    to {transform: scale(1.3);}
  }

  .bar1, .bar2, .bar3 {
    width: 16px;
    height: 2px;
    background-color: rgb(var(--white));
    margin: 2px 0;
    transition: 400ms;
  }

  .change .bar1 {transform: translate(0, 4px) rotate(-45deg);}
  .change .bar2 {opacity: 0;}
  .change .bar3 {transform: translate(0, -4px) rotate(45deg);}

.arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 2px;
    transform: rotate(45deg);
  }
</style>

<div class="selected-deck">

  <div class="selected-deck__imgg">
    <img class="imgg" src="images/items/sm/{selectedIcon.get(deck.klass)}.png" alt="Hero" height="48" width="48"/>
    <div class="abs">
      <ButtonComponent isIcon on:click={() => {
        isMenuVisible = !isMenuVisible;
        soundService.play("click");
      }}>
        <div class="bar" class:change="{isMenuVisible}">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </ButtonComponent>
    </div>
    {#if isMenuVisible}
      <MenuComponent items={[
        ["Clear", clearDeck],
        ["Rename", changeDeckName],
        ["Save", saveDeck],
        ["Switch", switchDeck]
      ]}/>
    {/if}
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
              <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
            {/if}
          </LinkComponent>
          <LinkComponent color="mana" on:click="{onSortManaCost}">
            {deck.average.manaCost.toFixed(2)}
            {#if currentSort === "Mana Cost"}
              <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
            {/if}
          </LinkComponent>
          <LinkComponent color="health" on:click="{onSortHealth}">
            {deck.average.health.toFixed(2)}
            {#if currentSort === "Health"}
              <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
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

    <!-- <div style="display: flex;">

          💾
          🗑
          ↺
          ✎
    </div> -->
  </div>

</div>
