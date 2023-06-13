<script lang="ts">
  import {cardsView} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import {gameStore, playerStore} from "stores";
  import type {Card} from "@som/shared/types/game";
  import { create_in_transition } from "svelte/internal";
  import { fly } from "svelte/transition";
  import { elasticOut, expoInOut } from "svelte/easing";
  import { items } from "data";

  let card: Card;
  let health = 0;
  let damage = 0;
  let mana = 0;
  let isClient = true;
  let isOpponent = false;
  const cardView = cardsView.get(card.id);
  let selektedSkin;
  let klassTooltip;
  let isToggled = false;

  const onToggleKlassTooltip = (): void => {
    isToggled = !isToggled;
    klassTooltip.style.opacity = isToggled ? "1" : "0";
  };

  export {card, health, damage, mana, isClient, isOpponent};

  let x: any;

  const spin = (node, {duration}) => ({
    duration,
    css(t: number) {
      const scale = (t + 0.2) / t;
      // translateX -50% because using only scale would overwrite standard css
      return `transform: translateX(-50%) scale(${scale});`
    }
  });

  // check which skin is selected
  $: {
    if (isClient) {
      selektedSkin = $playerStore.skins.find((skin) => skin.cardId === card.id);
    } else {
      if (isOpponent) {
        selektedSkin = $gameStore.opponent.skins ? $gameStore.opponent.skins.find((skin) => skin.cardId === card.id) : {cardId: 0, skinId: 0};
      } else {
        selektedSkin = $gameStore.player.skins ? $gameStore.player.skins.find((skin) => skin.cardId === card.id) : {cardId: 0, skinId: 0};
      }
    }
  }
</script>

<style>
  .card {
    position: relative;
    display: flex;
    /* overflow: hidden; */
    height: var(--card-height);
    width: var(--card-width);
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
    padding: var(--spacing-xsm);
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
    z-index: 7;
  }

  .card__klass__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    /* top: 100%;
    right: 15px; */
    height: var(--card-height);
    width: var(--card-width);
    /* height: 136px;
    width: 108px; */
    padding: var(--spacing-xsm);
    opacity: 0;
    /* background-color: rgba(32, 32, 32, 0.95); */
    /* backdrop-filter: blur(32px); */
    background-color: rgba(32, 32, 32, 0.98);
    box-sizing: border-box;
    border: 1px solid rgb(102, 102, 102);
    border-radius: 6px;
    /* text-align: justify; */
    z-index: 6;
    line-height: 1.5;
    font-size: var(--font-sm);
    transition: opacity 250ms cubic-bezier(var(--ease-in-out-quad));
  }

  /* .card__klass:hover .card__klass__tooltip {
    display: initial;
  } */

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
    bottom: 6px;
    right: 6px;
    z-index: 2;
  }

  .card__mana--center {
    bottom: 8px;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }

  .card__health {
    position: absolute;
    bottom: 6px;
    left: 6px;
    z-index: 2;
  }

  .card__health__num {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }

  .card__damage {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__ability {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__ability:hover .card__ability__tooltip {
    display: initial;
  }

  .card__ability__tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    height: 136px;
    width: 108px;
    padding: var(--spacing-xsm);
    display: none;
    background-color: rgba(32, 32, 32, 0.95);
    box-sizing: border-box;
    font-size: 0.8rem;
    transform: translateX(-50%);
    z-index: 0;
  }

  

  .card__avatar {
    position: absolute;
    top: 30px;
    left: 18px;
  }

  .card__front {
    z-index: 1;
  }
</style>

<div class="card">
  <div class="card__type">
    {#if card.type === CardType.HERO}
      <img src="assets/attrs/hero.png" alt="Hero"/>
    {:else if card.type === CardType.MINION}
      <img src="assets/attrs/minion.png" alt="Minion"/>
    {:else if card.type === CardType.MAGIC}
      <img src="assets/attrs/magic.png" alt="Magic"/>
    {:else}
      <img src="assets/attrs/trap.png" alt="Trap"/>
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

  <div class="card__klass" on:click={onToggleKlassTooltip}>
    {#if card.klass === CardKlass.SOLID}
      <img src="assets/classes/24/{CardKlass.SOLID}.png" alt="Solid"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img src="assets/classes/24/{CardKlass.LIQUID}.png" alt="Liquid"/>
    {:else if card.klass === CardKlass.GAS}
      <img src="assets/classes/24/{CardKlass.GAS}.png" alt="Gas"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img src="assets/classes/24/{CardKlass.PLASMA}.png" alt="Plasma"/>
    {:else}
      <img src="assets/classes/24/{CardKlass.NEUTRAL}.png" alt="Neutral"/>
    {/if}
  </div>
    <div class="card__klass__tooltip" bind:this={klassTooltip}>
      {cardView ? cardView.effect.name : "nema"}
      <hr/>
      {@html cardView.effect.description}
    </div>

  <div class="card__name">{cardView ? cardView.name : "nema"}</div>
  <img class="card__front" src="assets/cards/card-front.png" alt="Card Border"/>

  {#if selektedSkin && selektedSkin.skinId !== 0}
    {#if !items.find((item) => item.id === selektedSkin.skinId).rarity || items.find((item) => item.id === selektedSkin.skinId).rarity === 0}
      <img class="card__avatar" src="assets/items/{selektedSkin.skinId}.png" alt={selektedSkin.skinId}/>
    {:else}
      <video class="card__avatar" autoplay loop muted>
        <source src="assets/items/{selektedSkin.skinId}.webm" type="video/webm"/> {selektedSkin.skinId}
      </video>
    {/if}
  {:else}
    <img class="card__avatar" src="assets/cards/{card.id}.jpg" height=136 width=108/>
  {/if}

<!-- 
  {#if isClient}
    {#if $playerStore.selectedSkins.get(card.id) > 0}
      <img class="card__avatar" src="assets/cards/{card.id}/{x.skinId}{x.extension}" alt={card.name} height=136 width=108/>
    {:else}
      <img class="card__avatar" src="assets/cards/{card.id}.jpg" alt={card.name} height=136 width=108/>
    {/if}
  {:else}
    {#if isOpponent}
      {#if $gameStore.selectedSkins.opponent.find(({key}) => key === card.id).value > 0}
        <img class="card__avatar" src="assets/cards/{card.id}/{x.skinId}{x.extension}" alt={card.name} height=136 width=108/>
      {:else}
        <img class="card__avatar" src="assets/cards/{card.id}.jpg" alt={card.name} height=136 width=108/>
      {/if}
    {:else}
      {#if $gameStore.selectedSkins.player.find(({key}) => key === card.id).value > 0}
        <img class="card__avatar" src="assets/cards/{card.id}/{x.skinId}{x.extension}" alt={card.name} height=136 width=108/>
      {:else}
        <img class="card__avatar" src="assets/cards/{card.id}.jpg" alt={card.name} height=136 width=108/>
      {/if}
    {/if}
  {/if} -->

  {#if card.type === CardType.HERO}
    <div class="card__health">
      <img src="assets/attrs/health.png" alt="Health"/>
      <div class="card__health__num">{health || card.health}</div>
    </div>
    <div class="card__ability">
      <img src="assets/abilities/{card.ability}.png" alt="Neurotoxin"/>
      <div class="card__ability__tooltip">
        {cardView.ability.name}
        <hr/>
        {cardView.ability.description}
      </div>
    </div>
    <div class="card__mana">
      <img src="assets/attrs/mana.png" alt="Mana"/>
      <div class="card__health__num">{mana || card.mana}</div>
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="assets/attrs/health.png" alt="Health"/>
      {#key card.health}
        <div class="card__health__num" in:spin={{duration: 1000}}>{card.health}</div>
      {/key}
    </div>
    <div class="card__damage">
      <img src="assets/attrs/damage.png" alt="Damage"/>
      <div class="card__health__num">{damage || card.damage}</div>
    </div>
    <div class="card__mana">
      <img src="assets/attrs/manacost.png" alt="Mana cost"/>
      <div class="card__health__num">{card.manaCost}</div>
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="assets/attrs/manacost.png" alt="Mana cost"/>
      <div class="card__health__num">{card.manaCost}</div>
    </div>
  {/if}
</div>
