<script lang="ts">
  import {onMount} from "svelte";
  import {cardEffectNames, cardsView, items} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import {gameStore} from "stores";
  import {TextComponent} from "ui";
  import {fade, type EasingFunction, type TransitionConfig} from "svelte/transition";
  import type {GameCard} from "@som/shared/types/mongo";
    import { soundService } from "services";
    import { quadInOut } from "svelte/easing";

  let card: GameCard;

  let cardView = {
    id: 0,
    name: "",
    lore: "",
    effect: {name: "", description: ""},
    ability: {name: "", description: ""}
  };
  let selectedSkin = {cardId: 0, skinId: 0};
  let item = items[0];

  let klassTooltip: any;
  let abilityElement: HTMLDivElement;
  let isGrayscale = false;

  let isToggled = false;

  let isOpponent = false;
  let isSelected = false;
  let isAttackable = false;
  let isTargetable = false;
  let isFriendlyTargetable = false;
  let isAbilityTooltipToggled = false;

  const onToggleKlassTooltip = (): void => {
    isToggled = !isToggled;
    klassTooltip.style.zIndex = isToggled ? "10" : "-1";
    klassTooltip.style.opacity = isToggled ? "1" : "0";
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

  export {card, isOpponent, isSelected, isAttackable, isTargetable, isFriendlyTargetable, isGrayscale};

  interface Spin {
    delay: number | undefined;
    duration: number | undefined;
    easing: EasingFunction | undefined;
  }

  const spin = (
    node: Element,
    {delay, duration, easing}: Spin
  ): TransitionConfig => ({
    delay,
    duration,
    easing,
    css: (t) => `transform: scale(${(t + 0.4) / t});`
  });

  onMount((): void => {
    if (isOpponent) {
      selectedSkin = $gameStore.opponent.skins?.find((skin): boolean => skin.cardId === card.id) || {cardId: 0, skinId: 0};
    } else {
      selectedSkin = $gameStore.player.skins?.find((skin): boolean => skin.cardId === card.id) || {cardId: 0, skinId: 0};
    }

    cardView = cardsView.find(({id}): boolean => card.id === id);
    item = items.find(({id}): boolean => selectedSkin.skinId === id) || items[0];
  });
</script>

<style>
 .isGrayscale {
    filter: grayscale(1);
  }
  .card {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    /* box-sizing: border-box; */
    /* overflow: hidden; */
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

  .card__type__tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    /* height: 135px;
    width: 108px; */
    padding: var(--xsm);
    display: none;
    background-color: rgba(32, 32, 32, 0.95);
    box-sizing: border-box;
    font-size: 0.8rem;
  }

  .card__type:hover .card__type__tooltip {
    display: initial;
  }

  .card__klass {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 11;
  }

  .card__klass__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--card-height);
    width: var(--card-width);
    padding: var(--xs);
    opacity: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    box-sizing: border-box;
    border-radius: 8px;
    z-index: -1;
    /* line-height: 1.25; */
    font-size: var(--sm);
    transition: opacity 400ms cubic-bezier(var(--ease-in-out-quad));
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
    font-size: 0.8rem;
    text-align: center;
    z-index: 2;
  }

  .card__mana {
    position: absolute;
    bottom: 3px;
    right: 3px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__health__num {
    width: var(--md);
    height: var(--md);
    font-size: var(--xs);
    border: 1px solid rgba(var(--health), var(--opacity-sm));
    background-color: rgb(var(--dark-grey));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card__damage__num {
    border-color: rgba(var(--damage), var(--opacity-sm));
  }
  .card__mana__num {
    border-color: rgba(var(--mana), var(--opacity-sm));
  }

  .card__damage {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  .isSelected {
    position: relative;
    cursor: pointer;
    animation: selectedBorderGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }
  .isFriendlyTargetable {
    position: relative;
    cursor: pointer;
    animation: friendlyBorderGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  .isAttackable, .isTargetable {
    position: relative;
    animation: attackableBorderGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  .isSelected::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 16px 1px rgb(var(--white));
    opacity: 0;
    animation: shadowGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }
  .isFriendlyTargetable::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 16px 1px rgb(var(--success));
    opacity: 0;
    animation: shadowGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

 .isAttackable::after, .isTargetable::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 16px 1px rgb(var(--warn));
    opacity: 0;
    animation: shadowGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes shadowGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  @keyframes selectedBorderGlow {
    from {border-color: rgba(var(--grey), 0.333);}
    to {border-color: rgba(var(--white), 0.666);}
  }

  @keyframes attackableBorderGlow {
    from {border-color: rgba(var(--grey), 0.333);}
    to {border-color: rgba(var(--warn), 0.666);}
  }

  @keyframes friendlyBorderGlow {
    from {border-color: rgba(var(--grey), 0.333);}
    to {border-color: rgba(var(--success), 0.666);}
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card" class:isSelected class:isAttackable class:isTargetable class:isFriendlyTargetable on:click>
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
  </div>

  <div class="card__klass" on:click|stopPropagation={onToggleKlassTooltip}>
    {#if card.klass === CardKlass.SOLID}
      <img src="images/card/solid.png" alt="Solid"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img src="images/card/liquid.png" alt="Liquid"/>
    {:else if card.klass === CardKlass.GAS}
      <img src="images/card/gas.png" alt="Gas"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img src="images/card/plasma.png" alt="Plasma"/>
    {:else}
      <img src="images/card/neutral.png" alt="Neutral"/>
    {/if}
  </div>

  <div class="card__klass__tooltip" bind:this={klassTooltip}>
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

  <div class="card__name">{cardView ? cardView.name : "nema"}</div>
  <img class="card__front" src="images/card/card-front.png" alt="Card Border"/>

  {#if item.rarity === 0 || item.rarity === 3}
    <img class="card__avatar" class:isGrayscale src="images/items/{selectedSkin.skinId}.png" height=136 width=108 alt="Card skin"/>
  {:else}
    <video class="card__avatar" class:isGrayscale autoplay loop muted>
      <source src="images/items/{selectedSkin.skinId}.webm" type="video/webm"/> {selectedSkin.skinId}
    </video>
  {/if}

  {#if isAbilityTooltipToggled}
    <div class="card__ability__tooltip" use:onAbilityTooltip in:fade="{{duration: 333, easing: quadInOut}}">
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
        <img src="images/card/rejuvenate.png" alt="Rejuvenate"/>
      {:else if card.ability === 2}
        <img src="images/card/neurotoxin.png" alt="Neurotoxin"/>
      {:else}
        <img src="images/card/electrocute.png" alt="Electrocute"/>
      {/if}

      <!-- <div class="card__ability__tooltip">
        {#if cardView}
          {cardView.ability?.name}
          <hr/>
          {cardView.ability?.description}
        {/if}
      </div> -->
    </div>
    <div class="card__mana">
      <img src="images/card/mana-capacity.png" alt="Mana"/>
        <div class="card__health__num card__mana__num">
          {#key card.mana.current}
            <div in:spin={{duration: 100}}>{card.mana.current}</div>
          {/key}
        </div>
    </div>
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
        <div class="card__health__num card__health__num" >
          {#key card.health.current}
            <div in:spin={{duration: 100}}>{card.health.current}</div>
          {/key}
        </div>
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
        <div class="card__health__num card__health__num">
          {#key card.health.current}
            <div in:spin={{duration: 100}}>{card.health.current}</div>
          {/key}
        </div>
    </div>
    <div class="card__damage">
      <img src="images/card/damage.png" alt="Damage"/>
        <div class="card__health__num card__damage__num">
          {#key card.damage.current}
            <div in:spin={{duration: 100}}>{card.damage.current}</div>
          {/key}
        </div>
    </div>
    <div class="card__mana">
      <img src="images/card/mana-cost.png" alt="Mana cost"/>
        <div class="card__health__num card__mana__num">
        {#key card.manaCost.current}
          <div in:spin="{{duration: 100}}">{card.manaCost.current}</div>
        {/key}
        </div>
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="images/card/mana-cost.png" alt="Mana cost"/>
        <div class="card__health__num card__mana__num">
          {#key card.manaCost.current}
            <div in:spin={{duration: 100}}>{card.manaCost.current}</div>
          {/key}
        </div>
    </div>
  {/if}
</div>
