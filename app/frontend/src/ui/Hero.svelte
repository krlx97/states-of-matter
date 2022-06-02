<script lang="ts">
  import {CardKlass} from "@som/shared/enums";
  import type {GameHero} from "@som/shared/types/client";

  let hero: GameHero;
  let health: number = hero.health;
  let mana: number = hero.health;
  let isHealthBarVisible = false;
  let isManaBarVisible = false;

  let abilityTooltip: HTMLElement;

  const abilityMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    abilityTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    abilityTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };

  export {hero, health, mana,isHealthBarVisible, isManaBarVisible};
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .card {
    position: relative;
    display: flex;
    border: 1px solid $light-grey;
    box-sizing: border-box;

    &:hover {cursor: pointer;}
    &__overlay {z-index: 1;}

    &__img {
      position: absolute;
      top: 29px;
      left: 18px;
      height: 142px;
      width: 108px;
    }

    &__type {
      position: absolute;
      top: 9px;
      left: 9px;
      z-index: 3;

      &__img {
        height: 16px;
        width: 16px;
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

    &__klass {
      position: absolute;
      top: 9px;
      right: 9px;
      z-index: 3;

      &__img {
        height: 16px;
        width: 16px;
      }
    }

    &__healthbar {
      position: absolute;
      bottom: 3px;
      left: 11px;
      height: 3px;
      width: 43px;
      z-index: 3;

      &__progress {
        height: 3px;
        background-color: rgb(133, 199, 0);
        border-radius: 3px;
        transition: width 250ms linear;
      }
    }

    &__manabar {
      position: absolute;
      bottom: 3px;
      right: 11px;
      height: 3px;
      width: 43px;
      z-index: 3;

      &__progress {
        height: 3px;
        background-color: $blue;
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
  }

  // .tooltip {
  //   display: none;
  //   position: absolute;
  //   bottom: 0;
  //   left: 100%;
  //   width: 160px;
  //   padding: $spacing-sm;
  //   background-color: $light-grey;
  //   box-shadow: $elevation-lg;
  //   box-sizing: border-box;
  //   font-size: $font-sm;
  // }
</style>

<div class="card">

  <div class="card__type">
    <img class="card__type__img" src="assets/attrs/hero.png" alt="Hero"/>
  </div>

  <div class="card__name">{hero.name}</div>

  <div class="card__klass">
    {#if hero.klass === CardKlass.SOLID}
      <img class="card__klass__img" src="assets/classes/{CardKlass.SOLID}.png" alt="Minion"/>
    {:else if hero.klass === CardKlass.LIQUID}
      <img class="card__klass__img" src="assets/classes/{CardKlass.LIQUID}.png" alt="Magic"/>
    {:else if hero.klass === CardKlass.GAS}
      <img class="card__klass__img" src="assets/classes/{CardKlass.GAS}.png" alt="Magic"/>
    {:else}
      <img class="card__klass__img" src="assets/classes/{CardKlass.PLASMA}.png" alt="Magic"/>
    {/if}
  </div>

  <img class="card__overlay" src="assets/cards/herofront.png" alt="Card front"/>
  <img class="card__img" src="assets/classes/{hero.klass}_hero.jpg" alt={hero.name}/>

  <div class="card__health">{hero.health}</div>
  <div class="card__mana">{hero.mana}</div>

  {#if isHealthBarVisible}
    <div class="card__healthbar">
      <div
        class="card__healthbar__progress"
        style={`width: ${hero.health / hero.maxHealth * 100}%`}
      ></div>
    </div>
  {/if}
  {#if isManaBarVisible}
    <div class="card__manabar">
      <div
        class="card__manabar__progress"
        style={`width: ${hero.mana / hero.maxMana * 100}%`}
      ></div>
    </div>
  {/if}
</div>
