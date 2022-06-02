<script lang="ts">
  import {effectInfo} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import type {Card} from "../shared/models/view";

  let card: Card,
      health: number,
      damage: number,
      isFlipped = false,
      isHealthBarVisible = false,
      passiveTooltip: HTMLElement;

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

  // .scene {
  //   perspective: 1280px;
  //   height: 100%;
  //   width: 100%;
  // }
  // .rotated {transform: rotateY(180deg)}

  .card {
    position: relative;
    display: flex;
    border: 2px solid $light-grey;
    box-sizing: border-box;
    // box-shadow: $elevation-sm;
    // height: $card-height;
    // width: $card-width;
    // transition: box-shadow 225ms ease-in-out;
    // display: flex;
    // flex-direction: column;

    &:hover {cursor: pointer}

    &__type {
      position: absolute;
      top: 3px;
      left: 3px;
      z-index: 3;

      &__img {
        height: 24px;
        width: 24px;
      }
    }

    &__klass {
      position: absolute;
      top: 3px;
      right: 3px;
      z-index: 3;

      &:hover .tooltip2 {
        display: initial;
      }

      &__img {
        height: 24px;
        width: 24px;
      }
    }

    &__name {
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 84px;
      font-size: 0.8rem;
      text-align: center;
      z-index: 3;
    }

    &__healthbar {
      position: absolute;
      bottom: 4px;
      left: 50%;
      height: 3px;
      width: 91%;
      transform: translateX(-50%);
      z-index: 3;

      &__progress {
        height: 3px;
        background-color: rgb(133, 199, 0);
        border-radius: 3px;
        transition: width 250ms linear;
      }
    }

    &__mana {
      position: absolute;
      bottom: 6px;
      right: 19px;
      width: 28px;
      z-index: 3;
      font-size: 0.8rem;
      text-align: center;
    }

    &__health {
      position: absolute;
      bottom: 6px;
      left: 19px;
      width: 28px;
      z-index: 3;
      font-size: 0.8rem;
      text-align: center;
    }

    &__damage {
      position: absolute;
      bottom: 8px;
      left: 50%;
      width: 28px;
      transform: translateX(-50%);
      z-index: 3;
      font-size: 0.8rem;
      text-align: center;
    }

    &__bar {
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 90%;
      transform: translateX(-50%);
      z-index: 3;
    }

    &__header {
      height: 36px;
      @include flex($align-items: center);
      background-color: $dark-grey;
      padding-left: 4px;
    }

    &__attrs {
      height: 36px;
      @include flex($justify-content: space-evenly);
      background-color: $dark-grey;
    }
  }

  .tooltip2 {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    width: 128px;
    padding: $spacing-xsm;
    background-color: $light-grey;
    box-shadow: $elevation-lg;
    box-sizing: border-box;
    font-size: 0.8rem;
    z-index: 5;
  }

  .stat {
    position: relative;
    @include d-flex(column, center, center);

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

  .cardfront {
    z-index: 1;
  }
  .cardavatar {
    position: absolute;
    top: 29px;
    left: 18px;
    height: 142px;
    width: 108px;
    z-index: 0;
  }
</style>

<div class="card">
  <!-- <div class="card__header">

    <div class="stat__type" on:mousemove={passiveMouseMove}>

      {#if card.type === CardType.MINION}
        <Img src="attrs/minion.png" alt="Minion"/>
      {:else if card.type === CardType.MAGIC}
        <Img src="attrs/magic.png" alt="Magic"/>
      {:else}
        <Img src="attrs/trap.png" alt="Trap"/>
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
        <Text size="sm">{@html card.effect}</Text>
      </div>

    </div>

    <span class:isNeutral class:isSolid class:isLiquid class:isGas class:isPlasma>{card.name}</span>

  </div> -->

  <div class="card__type">
    {#if card.type === CardType.MINION}
      <img class="card__type__img" src="assets/attrs/minion.png" alt="Minion"/>
    {:else if card.type === CardType.MAGIC}
      <img class="card__type__img" src="assets/attrs/magic.png" alt="Magic"/>
    {:else}
      <img class="card__type__img" src="assets/attrs/trap.png" alt="Trap"/>
    {/if}
  </div>

  <div class="card__klass">
    {#if card.klass === CardKlass.SOLID}
      <img class="card__klass__img" src="assets/classes/{CardKlass.SOLID}.png" alt="Minion"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img class="card__klass__img" src="assets/classes/{CardKlass.LIQUID}.png" alt="Magic"/>
    {:else if card.klass === CardKlass.GAS}
      <img class="card__klass__img" src="assets/classes/{CardKlass.GAS}.png" alt="Magic"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img class="card__klass__img" src="assets/classes/{CardKlass.PLASMA}.png" alt="Magic"/>
    {:else}
      <img class="card__klass__img" src="assets/classes/{CardKlass.NEUTRAL}.png" alt="Trap"/>
    {/if}
    <div class="tooltip2">{effectInfo.get(card.effects[0])}</div>
  </div>

  <div class="card__name">{card.name}</div>

  {#if card.type === CardType.MINION}
    <img class="cardfront" src="assets/cards/minionfront.png" alt="Card front"/>
  {:else if card.type === CardType.MAGIC || card.type === CardType.TRAP}
    <img class="cardfront" src="assets/cards/magicfront.png" alt="Card front"/>
  {/if}

  <img class="cardavatar" src="assets/cards/{card.klass}/{card.id}.jpg" alt={card.name}/>

  {#if card.type === CardType.MINION}
    <div class="card__health">{health || card.health}</div>
    <div class="card__damage">{damage || card.damage}</div>
  {/if}

  <div class="card__mana">{card.manaCost}</div>

  {#if isHealthBarVisible}
    <div class="card__healthbar">
      <div
        class="card__healthbar__progress"
        style={`width: ${health / card.health * 100}%`}
      ></div>
    </div>
  {/if}
</div>
