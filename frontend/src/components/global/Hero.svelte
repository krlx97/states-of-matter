<script lang="ts">
    import {ProgressBar} from "components";
  import type {Hero} from "models/view";
  import {game} from "game/stores";

  let hero: Hero;
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
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .card {
    position: relative;
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    box-shadow: $elevation-sm;
    box-sizing: border-box;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: $elevation-lg;
      cursor: pointer;
    }

    &__img {
      display: block;
      height: $game-card-height;
      width: $game-card-width;
    }

    &__bar {
      position: absolute;
      bottom: 48px;
      left: 50%;
      width: 80%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }

    &__manabar {
      position: absolute;
      bottom: 36px;
      left: 50%;
      width: 70%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }

    &__attrs {
      height: 32px;
      @include d-flex(row, center, center);
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
    height: 32px;
    width: 32px;
    @include d-flex(column, center, space-evenly);
    font-size: $font-sm;

    span {
      color: white;
    }
    // &:last-child { margin-bottom: 0; }

    &__type {
      color: white;
      &:hover .tooltip { display: initial; }
    }
    &__damage { color: $orange }
    &__health { color: $green }
    &__mana { color: $blue }
    &__solid { color: $solid }
    &__liquid { color: $liquid }
    &__gas { color: $gas }
    &__plasma { color: $plasma }
  }
</style>

<!-- 
<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  $passive-dimension: 40px;
  $ability-dimension: 48px;

  .hero {
    position: relative;
    height: $game-card-height;
    width: $game-card-width;
    box-shadow: $elevation-sm;
    cursor: pointer;

    &:hover { box-shadow: $elevation-lg; }

    &__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: $spacing-sm;
      background-color: $dark-grey;
      box-sizing: border-box;
      cursor: pointer;
      font-size: $font-md;
    }

    &__img {
      height: $game-card-height;
      width: $game-card-width;
      display: block;
    }


    &__attributes {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
    }

    &__ability {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &__resources {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
    }
  }

  .attribute {
    position: relative;
    height: $passive-dimension;
    width: $passive-dimension;
    @include d-flex(column, center, center);
    background-color: $dark-grey;
    border-radius: 50%;
    // box-shadow: $elevation-sm;
    box-sizing: border-box;
    font-size: $font-sm;

    &:hover &__tooltip { display: initial; }

    &__tooltip {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      width: $game-card-width;
      padding: $spacing-sm;
      background-color: $light-grey;
      box-shadow: $elevation-lg;
      box-sizing: border-box;
      font-size: $font-md;
    }

    &__damage { border: 2px solid $orange; }
    &__health { border: 2px solid $green; }
    &__mana { border: 2px solid $blue; }

    &__solid { border: 2px solid $solid; }
    &__liquid { border: 2px solid $liquid; }
    &__gas { border: 2px solid $gas; }
    &__plasma { border: 2px solid $plasma; }
  }

  .ability {
    position: relative;
    height: $ability-dimension;
    width: $ability-dimension;
    @include d-flex(column, center, center);
    background-color: $dark-grey;
    border-radius: 50%;
    // box-shadow: $elevation-sm;
    box-sizing: border-box;
    font-size: $font-sm;

    &__solid { border: 4px solid $solid; }
    &__liquid { border: 4px solid $liquid; }
    &__gas { border: 4px solid $gas; }
    &__plasma { border: 4px solid $plasma; }

    &:hover &__tooltip { display: initial; }

    &__tooltip {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      width: $game-card-width;
      padding: $spacing-sm;
      background-color: $light-grey;
      box-shadow: $elevation-lg;
      box-sizing: border-box;
      font-size: $font-md;
      z-index: 1000;
    }
  }
</style> -->

<!-- <div class="hero">

  <div class="hero__header">
    {hero.name}
  </div>

  <img class="hero__img" src="assets/classes/{hero.klass}_hero.jpg" alt="Hero">

  <div class="hero__attributes">

    <div
      class="attribute"
      class:attribute__solid={hero.klass === heroKlass.SOLID}
      class:attribute__liquid={hero.klass === heroKlass.LIQUID}
      class:attribute__gas={hero.klass === heroKlass.GAS}
      class:attribute__plasma={hero.klass === heroKlass.PLASMA}
      on:mousemove={passiveMouseMove}>

      <div class="attribute__tooltip" bind:this={passiveTooltip}>
        <span
          class:f--solid={hero.klass === heroKlass.SOLID}
          class:f--liquid={hero.klass === heroKlass.LIQUID}
          class:f--gas={hero.klass === heroKlass.GAS}
          class:f--plasma={hero.klass === heroKlass.PLASMA}>
          {@html hero.passive.name}
        </span>
        <br>
        {@html hero.passive.info}
      </div>

      <i
        class="fas fa-fw"
        class:fa-shield-alt={hero.klass === heroKlass.SOLID}
        class:fa-tint={hero.klass === heroKlass.LIQUID}
        class:fa-radiation={hero.klass === heroKlass.GAS}
        class:fa-burn={hero.klass === heroKlass.PLASMA}>
      </i>

      <span>{hero.passive.amount}</span>

    </div>

    <div class="attribute attribute__damage">
      <i class="fas fa-fire fa-fw"></i> <span>{hero.damage}</span>
    </div>
  </div>

  <div class="hero__ability">
    <div
      class="ability"
      class:ability__solid={hero.klass === heroKlass.SOLID}
      class:ability__liquid={hero.klass === heroKlass.LIQUID}
      class:ability__gas={hero.klass === heroKlass.GAS}
      class:ability__plasma={hero.klass === heroKlass.PLASMA}
      on:mousemove={abilityMouseMove}>
      <div class="ability__tooltip" bind:this={abilityTooltip}>
        <span
          class:f--solid={hero.klass === heroKlass.SOLID}
          class:f--liquid={hero.klass === heroKlass.LIQUID}
          class:f--gas={hero.klass === heroKlass.GAS}
          class:f--plasma={hero.klass === heroKlass.PLASMA}>
          {@html hero.active.name}
        </span><br>
        [<span class="f--blue">{hero.active.manaCost} <i class="fas fa-battery-full"></i></span>]
        {@html hero.active.info}
      </div>

      <i class="fas fa-medkit fa-2x fa-fw"></i>
    </div>
  </div>

  <div class="hero__resources">
    <div class="attribute attribute__mana">
      <i class="fas fa-battery-full fa-fw"></i> <span>{hero.mana}</span>
    </div>
    <div class="attribute attribute__health">
      <i class="fas fa-heart fa-fw"></i> <span>{hero.health}</span>
    </div>
  </div>

</div> -->



<div class="card">

  <img
    class="card__img"
    src="assets/classes/{hero.klass}_hero.jpg"
    alt={hero.name}
  />

  {#if isHealthBarVisible}
    <div class="card__bar">
      <ProgressBar size="md" progress={health / hero.health * 100} color="green"/>
    </div>
  {/if}
  {#if isManaBarVisible}
    <div class="card__manabar">
      <ProgressBar size="sm" progress={mana / hero.mana * 100} color="blue"/>
    </div>
  {/if}

  <div class="card__attrs">

    <div class="stat stat__type" on:mousemove={passiveMouseMove}>
      <i class="fas fa-mask fa-fw"></i>

      <div class="tooltip" bind:this={passiveTooltip}>
        <h3>
          {hero.name}
        </h3>
        <br/>
        <p>
          {@html hero.passive.info}
        </p>
        <hr/>
        <p>
          {@html hero.active.info}
        </p>
      </div>
    </div>

    <div class="stat stat__mana">
      <i class="fas fa-battery-half fa-fw"></i> <span>{mana || hero.mana}</span>
    </div>

    <div class="stat stat__health">
      <i class="fas fa-heart fa-fw"></i> <span>{health || hero.health}</span>
    </div>

    <div class="stat stat__damage">
        <i class="fas fa-fire fa-fw"></i> <span>{hero.damage}</span>
    </div>

    {#if hero.klass === 1}
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
    {/if}
  </div>
</div>
