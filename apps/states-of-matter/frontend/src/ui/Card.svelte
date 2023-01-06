<script lang="ts">
  import {CardType, CardKlass} from "@som/shared/enums";
  import {cardEffectNames, cardEffects, cardSkins} from "data";
  import {gameStore, playerStore} from "stores";
  import type {Card} from "@som/shared/types/game";

  let card: Card;
  let health = 0;
  let damage = 0;
  let mana = 0;
  let isClient = true;
  let isOpponent = false;

  export {card, health, damage, mana, isClient, isOpponent};

  let x: any;

  // check which skin is selected
  $: {
    if (isClient) {
      x = cardSkins.get(card.id).find((skin) => skin.skinId === $playerStore.selectedSkins.get(card.id));
    } else {
      if (isOpponent) {
        x = cardSkins
          .get(card.id)
          .find((skin) => skin.skinId === $gameStore.selectedSkins.opponent.find(({key}) => key === card.id).value)
      } else {
        x = cardSkins
          .get(card.id)
          .find((skin) => skin.skinId === $gameStore.selectedSkins.player.find(({key}) => key === card.id).value);
      }
    }
  }
</script>

<style>
  .card {
    position: relative;
    display: flex;
    overflow: hidden;
  }

  .card:hover {
    cursor: pointer;
  }

  .card__type {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 3;
  }

  .card__klass {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 3;
  }

  .card__klass:hover .tooltip2 {
    display: initial;
  }

  .card__name {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 84px;
    font-size: 0.8rem;
    text-align: center;
    z-index: 3;
  }

  .card__mana {
    position: absolute;
    bottom: 6px;
    right: 19px;
    width: 28px;
    z-index: 3;
    font-weight: bold;
    text-align: center;
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
    left: 19px;
    width: 28px;
    z-index: 3;
    font-weight: bold;
    text-align: center;
  }

  .card__damage {
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 28px;
    transform: translateX(-50%);
    z-index: 3;
    font-weight: bold;
    text-align: center;
  }

  .tooltip2 {
    position: absolute;
    top: 100%;
    right: 15px;
    height: 135px;
    width: 108px;
    padding: var(--spacing-xsm);
    display: none;
    background-color: rgba(32, 32, 32, 0.95);
    box-sizing: border-box;
    font-size: 0.8rem;
    z-index: 5;
  }

  .card__front {
    z-index: 1;
  }

  .card__avatar {
    position: absolute;
    top: 30px;
    left: 18px;
    /* height: 136px;
    width: 108px; */
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
  </div>

  <div class="card__klass">
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

    {#if card.type !== CardType.HERO}
      <div class="tooltip2">
        {cardEffectNames.get(card.effect.id)}
        <hr/>
        {cardEffects.get(card.effect.id)}
      </div>
    {/if}
  </div>

  <div class="card__name">{card.name}</div>
  <img class="card__front" src="assets/cards/card-front.png" alt="Card front"/>

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
  {/if}

  {#if card.type === CardType.HERO}
    <div class="card__health">
      <img src="assets/attrs/health.png" alt="Health"/>
      {health || card.health}
    </div>
    <div class="card__mana">
      <img src="assets/attrs/mana.png" alt="Mana"/>
      {mana || card.mana}
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="assets/attrs/health.png" alt="Health"/>
      {health || card.health}
    </div>
    <div class="card__damage">
      <img src="assets/attrs/damage.png" alt="Damage"/>
      {damage || card.damage}
    </div>
    <div class="card__mana">
      <img src="assets/attrs/manacost.png" alt="Mana cost"/>
      {card.manaCost}
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="assets/attrs/manacost.png" alt="Mana cost"/>
      {card.manaCost}
    </div>
  {/if}
</div>
