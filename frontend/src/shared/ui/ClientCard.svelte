<script lang="ts">
  import {onMount} from "svelte";
  import {quadInOut} from "svelte/easing";
  import {fade} from "svelte/transition";
  import {cardsView, items} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import {soundService} from "services";
  import {playerStore} from "stores";
  import TextComponent from "./Text.svelte";
  import type {ClientCard} from "@som/shared/types/game";

  let card: ClientCard;
  let isGlowing = false;
  let isGrayscale = false;

  let cardView = {
    id: 0,
    name: "",
    lore: "",
    effect: {name: "", description: ""},
    ability: {name: "", description: ""}
  };
  let item = items[0];
  let selectedSkin = {cardId: 0, skinId: 0};
  let klassElement: HTMLDivElement;
  let abilityElement: HTMLDivElement;
  let isKlassTooltipToggled = false;
  let isAbilityTooltipToggled = false;

  const onToggleKlassTooltip = (): void => {
    soundService.play("click");
    isKlassTooltipToggled = !isKlassTooltipToggled;
    klassElement.style.zIndex = !isKlassTooltipToggled ? "2" : "11";
  };

  const onToggleAbilityTooltip = (): void => {
    soundService.play("click");
    isAbilityTooltipToggled = !isAbilityTooltipToggled;
    abilityElement.style.zIndex = !isAbilityTooltipToggled ? "2" : "10";
  };

  const onAbility = (node: HTMLDivElement): void => {
    abilityElement = node;
  };

  const onAbilityTooltip = (node: HTMLDivElement): void => {
    node.style.display = !isAbilityTooltipToggled ? "none" : "initial";
  };

  const onKlassTooltip = (node: HTMLDivElement): void => {
    node.style.display = !isKlassTooltipToggled ? "none" : "initial";
  };

  onMount((): void => {
    selectedSkin = $playerStore.skins.find(({cardId}): boolean => card.id === cardId) || {cardId: 0, skinId: 0};
    cardView = cardsView.find(({id}): boolean => card.id === id) || {
      id: 13,
      name: "",
      lore: "",
      effect: {name: "", description: []}
    };
    item = items.find(({id}): boolean => selectedSkin.skinId === id) || items[0];
  });

  export {card, isGlowing, isGrayscale};
</script>

<style>
  .card {
    position: relative;
    display: flex;
    height: var(--card-height);
    width: var(--card-width);
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .isGrayscale {
    filter: grayscale(1);
  }

  .card:hover {
    cursor: pointer;
  }

  .card__type {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 2;
  }

  .card__type__tooltip, .card__mana__tooltip, .card__health__tooltip, .card__damage__tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 64px;
    display: none;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    box-sizing: border-box;
    font-size: var(--xs);
    text-align: center;
    transform: translateX(-50%);
  }

 .card__type:hover .card__type__tooltip {
    display: initial;
  }
  .card__mana:hover .card__mana__tooltip {
    display: initial;
  }
  .card__health:hover .card__health__tooltip {
    display: initial;
  }
  .card__damage:hover .card__damage__tooltip {
    display: initial;
  }

  .card__klass {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 2;
    transition: transform 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  .card__klass:hover {
    transform: translateY(-2px);
  }

  .card__klass__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--card-height);
    width: var(--card-width);
    padding: var(--xs);
    /* opacity: 0; */
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    box-sizing: border-box;
    border-radius: 8px;
    z-index: 10;
    /* line-height: 1.25; */
    font-size: var(--sm);
    /* transition: opacity 400ms cubic-bezier(var(--ease-in-out-quad)); */
  }

  .tooltip__name {
    margin-bottom: var(--xs);
    /* padding-bottom: var(--xs); */
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1;
  }

  .tooltip__text {
    line-height: 1.25;
  }

  .card__name {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 84px;
    font-size: var(--xs);
    text-align: center;
    z-index: 2;
  }

  .card__mana {
    position: absolute;
    bottom: 3px;
    right: 3px;
    z-index: 2;
  }

  .card__mana--center {
    bottom: 7px;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }

  .card__health {
    position: absolute;
    bottom: 3px;
    left: 3px;
    z-index: 2;
  }

  .card__health__num {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--xs);
  }

  .card__damage {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__ability {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__ability__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--card-height);
    width: var(--card-width);
    padding: var(--xs);
    /* opacity: 0; */
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    box-sizing: border-box;
    border-radius: 8px;
    z-index: 10;
    display: none;
    /* line-height: 1.25; */
    font-size: var(--sm);
    /* transition: opacity 400ms cubic-bezier(var(--ease-in-out-quad)); */
  }

  .card__ability__tooltip__name {
    display: flex;
    justify-content: space-between;
  }

  .card__avatar {
    position: absolute;
    top: 30px;
    left: 18px;
  }

  .card__front {
    z-index: 1;
  }

  .redglow {border-color: rgba(var(--solid), var(--opacity-sm));}
  .blueglow {border-color: rgba(var(--liquid), var(--opacity-sm));}
  .greenglow {border-color: rgba(var(--gas), var(--opacity-sm));}
  .purpleglow {border-color: rgba(var(--plasma), var(--opacity-sm));}
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="card"
  class:redglow="{isGlowing && card.klass === CardKlass.SOLID}"
  class:blueglow="{isGlowing && card.klass === CardKlass.LIQUID}"
  class:greenglow="{isGlowing && card.klass === CardKlass.GAS}"
  class:purpleglow="{isGlowing && card.klass === CardKlass.PLASMA}"
  on:click
  on:contextmenu|preventDefault>

  <div class="card__type">
    {#if card.type === CardType.HERO}
      <img src="images/card/hero.png" alt="Hero"/>
    {:else if card.type === CardType.MINION}
      <img src="images/card/minion.png" alt="Minion"/>
    {:else if card.type === CardType.MAGIC}
      <img src="images/card/magic.png" alt="Magic"/>
    {:else}
      <img src="images/card/trap.png" alt="Trap"/>
    {/if}
    <div class="card__type__tooltip">
      {#if card.type === CardType.HERO}
        Hero
      {:else if card.type === CardType.MINION}
        Minion
      {:else if card.type === CardType.MAGIC}
        Magic
      {:else}
        Trap
      {/if}
    </div>
  </div>

  <div class="card__klass" bind:this="{klassElement}" on:click|stopPropagation={onToggleKlassTooltip}>
    {#if card.klass === CardKlass.SOLID}
      <img src="images/card/{CardKlass.SOLID}.png" alt="Solid"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img src="images/card/{CardKlass.LIQUID}.png" alt="Liquid"/>
    {:else if card.klass === CardKlass.GAS}
      <img src="images/card/{CardKlass.GAS}.png" alt="Gas"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img src="images/card/{CardKlass.PLASMA}.png" alt="Plasma"/>
    {:else}
      <img src="images/card/{CardKlass.NEUTRAL}.png" alt="Neutral"/>
    {/if}
  </div>

  {#if isKlassTooltipToggled}
    <div class="card__klass__tooltip" use:onKlassTooltip in:fade="{{duration: 300, easing: quadInOut}}">
      {#if cardView}
        <div class="tooltip__name">{cardView.effect.name}</div>
        <div class="tooltip__text">
          {#each cardView.effect.description as chunk}
            {#if typeof chunk === "string"}
              {chunk}
            {:else}
              <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <div class="card__name">{cardView ? cardView.name : "nema"}</div>
  <img class="card__front" src="images/card/card-front.png" alt="Card Border"/>

  {#if item.rarity === 0 || item.rarity === 3}
    <img class:isGrayscale class="card__avatar" src="images/items/{selectedSkin.skinId}.png" height=136 width=108 alt="Card skin"/>
  {:else}
    <video class:isGrayscale class="card__avatar" autoplay loop muted>
      <source src="images/items/{selectedSkin.skinId}.webm" type="video/webm"/> {selectedSkin.skinId}
    </video>
  {/if}

  {#if isAbilityTooltipToggled}
    <div class="card__ability__tooltip" use:onAbilityTooltip in:fade="{{duration: 300, easing: quadInOut}}">
      {#if cardView}
        <div class="tooltip__name card__ability__tooltip__name">
          {cardView.ability?.name}
          <TextComponent color="mana">5</TextComponent>
        </div>
        <div class="tooltip__text">
          {#each cardView.ability.description as chunk}
            {#if typeof chunk === "string"}
              {chunk}
            {:else}
              <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if card.type === CardType.HERO}
    <div class="card__ability" use:onAbility on:click|stopPropagation="{onToggleAbilityTooltip}">
      {#if card.ability === 0}
        <img src="images/card/fortify.png" alt="Fortify"/>
      {:else if card.ability === 1}
        <img src="images/card/heal.png" alt="Rejuvenate"/>
      {:else if card.ability === 2}
        <img src="images/card/neurotoxin.png" alt="Neurotoxin"/>
      {:else}
        <img src="images/card/corruption.png" alt="Electrocute"/>
      {/if}
    </div>

    <div class="card__mana">
      <img src="images/card/mana.png" alt="Mana"/>
      <div class="card__health__num">{card.mana}</div>
      <div class="card__mana__tooltip">Mana capacity</div>
    </div>
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
      <div class="card__health__num">{card.health}</div>
      <div class="card__health__tooltip">Health</div>
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
      <div class="card__health__num">{card.health}</div>
      <div class="card__health__tooltip">Health</div>
    </div>
    <div class="card__damage">
      <img src="images/card/damage.png" alt="Damage"/>
      <div class="card__health__num">{card.damage}</div>
      <div class="card__damage__tooltip">Damage</div>
    </div>
    <div class="card__mana">
      <img src="images/card/manacost.png" alt="Mana cost"/>
      <div class="card__health__num">{card.manaCost}</div>
      <div class="card__mana__tooltip">Mana cost</div>
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="images/card/manacost.png" alt="Mana cost"/>
      <div class="card__health__num">{card.manaCost}</div>
      <div class="card__mana__tooltip">Mana cost</div>
    </div>
  {/if}
</div>
