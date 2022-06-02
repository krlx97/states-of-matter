<script lang="ts">
  import ProgressBar from "./ProgressBar.svelte";
  import Text from "./Text.svelte";
  import Img from "./Img.svelte";

  import type {GameHero} from "@som/shared/types/client";

  let hero: GameHero;
  let health: number = hero.health;
  let mana: number = hero.health;
  let isHealthBarVisible = false;
  let isManaBarVisible = false;

  let abilityTooltip: HTMLElement;
  let passiveTooltip: HTMLElement;
  let damageTooltip: HTMLElement;
  let manaTooltip: HTMLElement;

  enum heroKlass {SOLID = 1, LIQUID = 2, GAS = 3, PLASMA = 4};

  const abilityMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    abilityTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    abilityTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };

  const passiveMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    passiveTooltip.style.bottom = `calc(48px + ${-offsetY}px)`;
    passiveTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };
  const damageMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    damageTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    damageTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };
  const manaMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    manaTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    manaTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };

  export {hero, health, mana,isHealthBarVisible, isManaBarVisible};
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .card {
    position: relative;
    height: 100%;
    width: 100%;
    box-shadow: $elevation-sm;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: $elevation-lg;
      cursor: pointer;
    }

    &__img {
      height: $card-img-hw-sm;
      width: $card-img-hw-sm;
      display: block;
    }

    &__bar {
      position: absolute;
      bottom: calc(52px * 0.8);
      left: 50%;
      width: 80%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }

    &__manabar {
      position: absolute;
      bottom: calc(40px * 0.8);
      left: 50%;
      width: 70%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }
    &__header {
      height: calc(36px * 0.8);
      @include flex($align-items: center);
      background-color: $dark-grey;
      font-size: calc(1rem * 0.8);
    }
    &__attrs {
      height: calc(36px * 0.8);
      @include flex($align-items: center, $justify-content: space-evenly);
      background-color: $dark-grey;
    }
  }

  .tooltip {
    display: none;
    position: absolute;
    bottom: 0;
    left: 100%;
    width: 160px;
    padding: $spacing-sm;
    background-color: $light-grey;
    box-shadow: $elevation-lg;
    box-sizing: border-box;
    font-size: $font-sm;
  }

  .stat {
    position: relative;
    @include flex(column, center, space-between);

    &__img {
      height: calc(24px * 0.8);
      width: calc(24px * 0.8);
    }

    &__text {
      font-size: calc($font-sm * 0.8);
    }

    span {
      color: white;
    }
    // &:last-child { margin-bottom: 0; }

    &__type {
      color: white;
      &:hover .tooltip { display: initial; }
    }
   
    &__solid { color: $solid }
    &__liquid { color: $liquid }
    &__gas { color: $gas }
    &__plasma { color: $plasma }
  }
</style>

<div class="card">

  <div class="card__header">
    <div class="stat stat__type" on:mousemove={passiveMouseMove}>
      <img class="stat__img" src="assets/attrs/hero.png" alt="Hero"/>

      <div class="tooltip" bind:this={passiveTooltip}>
      </div>
    </div>

    <div>{hero.name}</div>
  </div>

  <img class="card__img" src="assets/classes/{hero.klass}_hero.jpg" alt={hero.name}/>

  {#if isHealthBarVisible}
    <div class="card__bar">
      <!-- <ProgressBar size="md" progress={health / hero.health * 100} color="green"/> -->
    </div>
  {/if}
  {#if isManaBarVisible}
    <div class="card__manabar">
      <!-- <ProgressBar size="sm" progress={mana / hero.mana * 100} color="blue"/> -->
    </div>
  {/if}

  <div class="card__attrs">

    <div class="stat stat__mana">
      <img class="stat__img" src="assets/attrs/mana.png" alt="Mana Capacity"/>
      <span class="stat__text">{mana || hero.mana}</span>
    </div>

    <div class="stat stat__health">
      <img class="stat__img" src="assets/attrs/health.png" alt="Health"/>
      <span class="stat__text">{health || hero.health}</span>
    </div>


    <!-- {#if hero.klass === 1}
      <div class="stat stat__solid">
        <i class="fas fa-shield-alt fa-fw"></i> <span>4</span>
      </div>
    {:else if hero.klass === 2}
      <div class="stat stat__liquid">
        <i class="fas fa-tint fa-fw"></i> <span>4</span>
      </div>
    {:else if hero.klass === 3}
      <div class="stat stat__gas">
        <i class="fas fa-radiation fa-fw"></i> <span>4</span>
      </div>
    {:else if hero.klass === 4}
      <div class="stat stat__plasma">
        <i class="fas fa-khanda fa-fw"></i> <span>4</span>
      </div>
    {/if} -->
  </div>
</div>
