<script lang="ts">
  import {CardType, CardKlass} from "@som/shared/enums";
  import {passives} from "@som/shared/data";

  import ProgressBar from "./ProgressBar.svelte";
  import Text from "./Text.svelte";
  import Img from "./Img.svelte";

  import type {Card} from "../shared/models/view";

  let card: Card,
      health: number,
      damage: number,
      isFlipped = false,
      isHealthBarVisible = false,
      passiveTooltip: HTMLElement;

  let isNeutral = card.klass === CardKlass.NEUTRAL;
  let isSolid = card.klass === CardKlass.SOLID;
  let isLiquid = card.klass === CardKlass.LIQUID;
  let isGas = card.klass === CardKlass.GAS;
  let isPlasma = card.klass === CardKlass.PLASMA;

  const flip = (): void => { isFlipped = !isFlipped; };

  const passiveMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    passiveTooltip.style.top = `calc(24px + ${offsetY}px)`;
    passiveTooltip.style.left = `calc(-12px + ${offsetX}px)`;
  };

  export {card, health, damage, isHealthBarVisible};
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .isNeutral  {color: rgb(253, 253, 253);}
  .isSolid    {color: rgb(255, 107, 107);}
  .isLiquid   {color: rgb(176, 230, 255);}
  .isGas      {color: rgb(168, 222, 84);}
  .isPlasma   {color: rgb(179, 104, 243);}

  .card {
    position: relative;
    height: $card-height-sm;
    width: $card-width-sm;

    &:hover {cursor: pointer;}

    &__header {
      height: calc(36px * 0.8);
      @include flex($align-items: center);
      background-color: $dark-grey;
      padding-left: calc(4px * 0.8);
      font-size: calc(1rem * 0.8);
    }

    &__img {
      height: $card-img-hw-sm;
      width: $card-img-hw-sm;
      display: block;
    }

    &__bar {
      position: absolute;
      bottom: calc(48px * 0.8);
      left: 50%;
      width: 80%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }

    &__attrs {
      height: calc(36px * 0.8);
      @include flex($justify-content: space-evenly);
      background-color: $dark-grey;
    }
  }

  .tooltip2 {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 144px;
    padding: $spacing-xsm;
    background-color: $light-grey;
    box-shadow: $elevation-lg;
    box-sizing: border-box;
    z-index: 100;
  }

  .stat {
    position: relative;
    @include d-flex(column, center, center);

    &__img {
      height: calc(24px * 0.8);
      width: calc(24px * 0.8);
    }

    &__text {
      font-size: calc($font-xsm * 0.8);
    }

    span {
      color: white;
    }
    &:last-child { margin-bottom: 0; }

    &__type { position: relative; &:hover .tooltip2 {display: initial} z-index: 101; margin-right: 4px; }
    &__damage { &:hover .tooltip2 {display: initial} }
    &__health { &:hover .tooltip2 {display: initial} }
    &__mana { &:hover .tooltip2 {display: initial} }
    &__solid { &:hover .tooltip2 {display: initial} }
    &__liquid { &:hover .tooltip2 {display: initial} }
    &__gas { &:hover .tooltip2 {display: initial} }
    &__plasma { &:hover .tooltip2 {display: initial} }
  }

  .att {
    height: calc(24px * 0.8);
    width: calc(24px * 0.8);
  }
</style>

<div class="card" class:rotated={isFlipped}>
  <div class="card__header">

    <div class="stat__type" on:mousemove={passiveMouseMove}>

      {#if card.type === CardType.MINION}
        <img class="att" src="assets/attrs/minion.png" alt="Minion"/>
      {:else if card.type === CardType.MAGIC}
        <img class="att" src="assets/attrs/magic.png" alt="Magic"/>
      {:else}
        <img class="att" src="assets/attrs/trap.png" alt="Trap"/>
      {/if}

      <div class="tooltip2" bind:this={passiveTooltip}>
        <Text color="purple" size="xsm">Passive:</Text>
        <br/>
        {#if card.klass !== CardKlass.NEUTRAL}
          <Text size="sm">
            {@html passives.find((passive) => passive.klass === card.klass).text}
          </Text>
        {:else}
          <Text size="sm">No passive.</Text>
        {/if}
        <hr/>
        <Text color="green" size="xsm">Effect:</Text>
        <br/>
        <!-- <Text size="sm">{@html card.effect}</Text> -->
      </div>

    </div>

    <span class:isNeutral class:isSolid class:isLiquid class:isGas class:isPlasma>{card.name}</span>

  </div>

  <img class="card__img" src="assets/cards/{card.klass}/{card.id}.jpg" alt={card.name}/>

  {#if isHealthBarVisible}
    <div class="card__bar">
      <ProgressBar progress={health / card.health * 100} color="green"/>
    </div>
  {/if}

  <div class="card__attrs">
    <div class="stat stat__mana">
      <img class="stat__img" src="assets/attrs/manacost.png" alt="Mana Cost"/>
      <span class="stat__text">{card.manaCost}</span>
    </div>
    {#if card.type === CardType.MINION}
      <div class="stat stat__health">
        <img class="stat__img" src="assets/attrs/health.png" alt="Health"/>
        <span class="stat__text">{health || card.health}</span>
      </div>
      <div class="stat stat__damage">
        <img class="stat__img" src="assets/attrs/damage.png" alt="Damage"/>
        <span class="stat__text">{damage || card.damage}</span>
      </div>
    {/if}
  </div>
</div>
