<script lang="ts">
  import {heroes} from "data";
  import {gameStore, playerStore} from "stores/data";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .hero {
    position: relative;
    height: $game-field-height;
    width: $game-field-width;
    box-shadow: $elevation-sm;

    &__img {
      height: $game-field-height;
      width: $game-field-width;
      display: block;
    }
  }

  $stat-dimension: 32px;

  .circle-stat-green,
  .circle-stat-orange,
  .circle-stat-red,
  .circle-stat-yellow,
  .circle-stat-purple,
  .circle-stat-blue {
    position: absolute;
    height: $stat-dimension;
    width: $stat-dimension;
    @include d-flex(column, center, center);
    background-color: rgba(var(--dark-grey), 0.9);
    border-radius: 50%;
    box-shadow: $elevation-md;
    cursor: pointer;
    font-size: $font-sm;
  }

  .circle-ability {
    position: absolute;
background-color: rgba(var(--dark-grey), 0.9);
    border-radius: 50%;
    box-shadow: $elevation-md;
    cursor: pointer;
    font-size: $font-sm;
    @include d-flex(column, center, center);
    bottom: 48px;
    height: 48px;
    width: 48px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid $purple;
    font-size: $font-md;
  }
  .circle-stat-yellow {
    bottom: -5%;
    left: calc(50% - 40px / 2);
    border: 2px solid rgb(var(--yellow));
  }
  .circle-stat-green {
    bottom: 4px;
    right: $stat-dimension;
    border: 2px solid $green;
  }
  .circle-stat-orange {
    bottom: 4px;
    left: $stat-dimension;
    border: 2px solid $orange;
  }
  .circle-stat-red {
    bottom: -5%;
    left: calc(50% - 40px / 2);
    border: 2px solid rgb(var(--red));
  }
  .circle-stat-purple {
    bottom: $stat-dimension;
    left: 4px;
    border: 2px solid $purple;
  }
  .circle-stat-blue {
    bottom: $stat-dimension;
    right: 4px;
    border: 2px solid $blue;
  }

  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: $spacing-sm;
    @include d-flex(row, center, space-between);
    background-color: rgb(var(--dark-grey), 0.9);
    box-sizing: border-box;
    cursor: pointer;
    font-size: $font-md;

    &:hover .tooltip { display: initial; }
    // font-size: $font-md;
  }
  .tooltip {
    display: none;
    position: absolute;
    top: 0;
    right: calc(100% + 1em);
    height: auto;
    width: 180px;
    padding: var(--spacing-sm);
    background-color: rgba(var(--light-grey), 0.95);
    box-shadow: var(--elevation-lg);
    font-size: 12px;
  }
</style>

<div class="hero">
  {#if $gameStore.playerA.username === $playerStore.username}
  <div class="header">
    <span>{heroes.get($gameStore.playerA.hero.id).name}</span>
    <i class="fas fa-mask fa-fw"></i>

    <div class="tooltip">
      {@html heroes.get($gameStore.playerA.hero.id).special.effect}
      {#if $gameStore.playerA.username !== $playerStore.username}
        {$gameStore.playerA.username}
      {:else}
        {$gameStore.playerB.username}
      {/if}
    </div>
  </div>

  <img class="hero__img" src="assets/classes/{$gameStore.playerA.hero.id}_hero.jpg" alt="Hero">

  <div class="circle-stat-green" data-tooltip="Health">
    <div>
      <i class="fas fa-heart"></i>
    </div>
    <div>
      {heroes.get($gameStore.playerA.hero.id).health}
    </div>
  </div>

  <div class="circle-stat-orange" data-tooltip="Damage">
    <div>
      <i class="fas fa-fire"></i>
    </div>
    <div>
      {heroes.get($gameStore.playerA.hero.id).damage}
    </div>
  </div>

  <div class="circle-ability" data-tooltip="Special Ability">
    <i class="fas fa-medkit fa-2x fa-fw"></i>
  </div>

  <div class="circle-stat-blue" data-tooltip="Mana">
    <div>
      <i class="fas fa-battery-full"></i>
    </div>
    <div>
      100
    </div>
  </div>

  <div class="circle-stat-purple" data-tooltip="Rejuvenation">
    <div>
      <i class="fas fa-tint"></i>
    </div>
    <div>
      {heroes.get($gameStore.playerA.hero.id).special.amount}
    </div>
  </div>
  {:else if $gameStore.playerB.username === $playerStore.username}
    <div class="header">
      <span>{heroes.get($gameStore.playerB.hero.id).name}</span>
      <i class="fas fa-mask fa-fw"></i>

      <div class="tooltip">
        {@html heroes.get($gameStore.playerB.hero.id).special.effect}
        {#if $gameStore.playerB.username !== $playerStore.username}
          {$gameStore.playerB.username}
        {:else}
          {$gameStore.playerB.username}
        {/if}
      </div>
    </div>

    <img class="hero__img" src="assets/classes/{$gameStore.playerB.hero.id}_hero.jpg" alt="Hero">

    <div class="circle-stat-green" data-tooltip="Health">
      <div>
        <i class="fas fa-heart"></i>
      </div>
      <div>
        {heroes.get($gameStore.playerB.hero.id).health}
      </div>
    </div>

    <div class="circle-stat-orange" data-tooltip="Damage">
      <div>
        <i class="fas fa-fire"></i>
      </div>
      <div>
        {heroes.get($gameStore.playerB.hero.id).damage}
      </div>
    </div>

    <div class="circle-ability" data-tooltip="Special Ability">
      <i class="fas fa-medkit fa-2x fa-fw"></i>
    </div>

    <div class="circle-stat-blue" data-tooltip="Mana">
      <div>
        <i class="fas fa-battery-full"></i>
      </div>
      <div>
        100
      </div>
    </div>

    <div class="circle-stat-purple" data-tooltip="Rejuvenation">
      <div>
        <i class="fas fa-tint"></i>
      </div>
      <div>
        {heroes.get($gameStore.playerB.hero.id).special.amount}
      </div>
    </div>
  {/if}
</div>