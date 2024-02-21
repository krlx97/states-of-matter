<script lang="ts">
  import {cards} from "@som/shared/data";
  import {CardKlass, CardType} from "@som/shared/enums";
  import {tutorialStore} from "stores";
  import {LinkComponent, SelectComponent} from "ui";
  import KlassCardComponent from "./KlassCard.svelte";
    import { soundService } from "services";

  let selectedKlass = "All";
  let selectedType = "All";
  let currentSort = "Initial";
  let sortAscending = true;
  let filteredCards = cards.filter((card): boolean => card.type !== CardType.HERO
    && (card.klass === 0 || card.klass === 1)
    );

  $: isTutorial2 =
    $tutorialStore.name === "deckBuilder" &&
    $tutorialStore.currentStep === 1;
  $: isTutorial =
    $tutorialStore.name === "deckBuilder" &&
    $tutorialStore.currentStep === 3;

  const onFilterCards = (): void => {
    filteredCards = cards
      .filter((card): boolean => card.type !== CardType.HERO && (card.klass === 0 || card.klass === 1))
      .filter((card) => {
        if (selectedKlass === "All") {
          return true;
        } else {
          if (selectedKlass === "Neutral" && card.klass === CardKlass.NEUTRAL) {
            return true;
          } else if (selectedKlass === "Solid" && card.klass === CardKlass.SOLID) {
            return true;
          } else if (selectedKlass === "Liquid" && card.klass === CardKlass.LIQUID) {
            return true;
          } else if (selectedKlass === "Gas" && card.klass === CardKlass.GAS) {
            return true;
          } else if (selectedKlass === "Plasma" && card.klass === CardKlass.PLASMA) {
            return true;
          } else {
            return false;
          }
        }
      })
      .filter((card) => {
        if (selectedType === "All") {
          return true;
        } else {
          if (selectedType === "Magic" && card.type === CardType.MAGIC) {
            return true;
          } else if (selectedType === "Minion" && card.type === CardType.MINION) {
            return true;
          } else if (selectedType === "Trap" && card.type === CardType.TRAP) {
            return true;
          } else {
            return false;
          }
        }
    });
  };

  const onSortInitial = (): void => {
    currentSort = "Initial";
    sortAscending = true;
    filteredCards = filteredCards.sort((a, b) => a.id - b.id);

    soundService.play("click");
  };

  const onSortDamage = (): void => {
    if (currentSort === "Damage") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Damage";
    }

    filteredCards = filteredCards.sort((a, b) => {
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

    filteredCards = filteredCards.sort((a, b) => {
      if (a.type !== CardType.HERO && b.type !== CardType.HERO) {
        return sortAscending ? a.manaCost - b.manaCost : b.manaCost - a.manaCost;
      } else {
        return 0;
      }
    });

    soundService.play("click");
  };

  const onSortHealth = (): void => {
    if (currentSort === "Health") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Health";
    }

    filteredCards = filteredCards.sort((a, b) => {
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
  .klass-cards {
    /* padding: var(--md) 0; */
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .cards__actions {
    display: flex;
    justify-content: space-between;
    /* margin: var(--xl) 0 var(--sm) 0; */
  }

  .cards__action {
    display: flex;
    gap: var(--md);
  }

  .cards__list {
    height: calc(218px * 2 + var(--md));
    padding: 0 var(--md);
    padding-right: calc(var(--md) - 4px);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--md);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .cards__list::-webkit-scrollbar {
    width: 4px;
  }

  .cards__list::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  .cards__list::-webkit-scrollbar-thumb {
    background-color: rgb(var(--grey));
    border-radius: 8px;
  }

  .isTutorial {
    position: relative;
    z-index: 101;
    animation: opa 1500ms linear infinite alternate
  }
  .isTutorial2 {
    position: relative;
    z-index: 101;
    animation: opa 1500ms linear infinite alternate
  }
  @keyframes opa {
    from {opacity: 0.5}
    to {opacity: 1}
  }

  .arrow {
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
  }
</style>

<div class="klass-cards" class:isTutorial class:isTutorial2>
  <div class="cards__actions">
    <div class="cards__action">
      <SelectComponent
        values="{[
          "All",
          "Neutral",
          "Solid",
          // "Liquid",
          // "Gas",
          // "Plasma"
        ]}"
        label="Class"
        bind:selected="{selectedKlass}"
        on:change="{onFilterCards}"/>

      <SelectComponent
        values="{["All", "Magic", "Minion", "Trap"]}"
        label="Type"
        bind:selected="{selectedType}"
        on:change="{onFilterCards}"/>
    </div>
    <div class="cards__action">
      <LinkComponent color="{currentSort === "Initial" ? "primary" : "white"}" on:click="{onSortInitial}">Initial</LinkComponent>
      <LinkComponent color="{currentSort === "Damage" ? "damage" : "white"}" on:click="{onSortDamage}">
        Damage
        {#if currentSort === "Damage"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
      <LinkComponent color="{currentSort === "Mana Cost" ? "mana" : "white"}" on:click="{onSortManaCost}">
        Mana Cost
        {#if currentSort === "Mana Cost"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
      <LinkComponent color="{currentSort === "Health" ? "health" : "white"}" on:click="{onSortHealth}">
        Health
        {#if currentSort === "Health"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
    </div>
  </div>

  <div class="cards__list">
    {#key filteredCards}
      {#each filteredCards as card}
        <KlassCardComponent {card}/>
      {/each}
    {/key}
  </div>

</div>
