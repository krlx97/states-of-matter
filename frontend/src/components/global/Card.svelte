<script lang="ts">
  import {ProgressBar} from "components";
  import {passives} from "data";
  import {CardType} from "enums";
  import type {Card} from "models/view";

  let card: Card,
      health: number,
      damage: number,
      isFlipped = false,
      isHealthBarVisible = false,
      passiveTooltip: HTMLElement;

  const flip = () => { isFlipped = !isFlipped; };

  const passiveMouseMove = (event: MouseEvent): void => {
    const {offsetX, offsetY} = event;

    passiveTooltip.style.bottom = `calc(48px + ${-offsetY}px)`;
    passiveTooltip.style.left = `calc(-80px + ${offsetX}px)`;
  };

  export {card, health, damage, isHealthBarVisible};
</script>

<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .scene { perspective: 1280px; }
  .rotated { transform: rotateY(180deg); }

  .card {
    position: relative;
    height: $card-height;
    width: $card-width;
    transform-style: preserve-3d;
    transform-origin: center center;
    box-shadow: $elevation-sm;
    box-sizing: border-box;
    transition: box-shadow 225ms ease-in-out, transform 450ms $ease-in-out-quart;

    &:hover {
      box-shadow: $elevation-lg;
      cursor: pointer;
    }

    &--front, &--back {
      position: absolute;
      height: 100%;
      width: 100%;
      backface-visibility: hidden;
    }

    &--back {
      transform: rotateY(-180deg);

      &__img {
        height: $card-height;
      }
    }
    &--front {
      display: flex;
      flex-direction: column;
    }

    &__bar {
      position: absolute;
      bottom: 36px;
      left: 50%;
      width: 80%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
    }

    &__img {
      display: block;
      height: $card-img-height;
      width: $card-img-width;
    }

    &__attrs {
      height: 32px;
      @include d-flex(row, center, center);
      background-color: $dark-grey;
    }
  }

  .tooltip2 {
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

  .tooltip {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    width: 128px;
    padding: $spacing-sm;
    background-color: $light-grey;
    box-shadow: $elevation-lg;
    box-sizing: border-box;
    font-size: $font-md;
  }

  .stat {
    position: relative;
    height: 32px;
    width: 32px;
    @include d-flex(column, center, center);
    font-size: $font-sm;

    span {
      color: white;
    }
    &:last-child { margin-bottom: 0; }

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
    &__plasma {
      color: $plasma;
      &:hover .tooltip2 {display: initial}
    }
  }
</style>

<div class="scene" on:contextmenu|preventDefault={flip}>
  <div class="card" class:rotated={isFlipped}>
    <div class="card--front">
      <img
        class="card__img"
        src="assets/cards/{card.klass}/{card.id}.jpg"
        alt={card.name}
      />

      {#if isHealthBarVisible}
        <div class="card__bar">
          <ProgressBar progress={health / card.health * 100} color="green"/>
        </div>
      {/if}

      <div class="card__attrs">
        <div class="stat stat__type">
          <i
            class="fas fa-fw"
            class:fa-star={card.type === CardType.MINION}
            class:fa-magic={card.type === CardType.MAGIC}
            class:fa-skull-crossbones={card.type === CardType.TRAP}>
          </i>

          <div class="tooltip">
            <h3>
              {card.name}
            </h3>
            {@html card.effect}
          </div>
        </div>

        <div class="stat stat__mana">
          <i class="fas fa-battery-half fa-fw"></i> <span>7</span>
        </div>

        {#if card.type === CardType.MINION}
          <div class="stat stat__health">
            <i class="fas fa-heart fa-fw"></i> <span>{health || card.health}</span>
          </div>
          <div class="stat stat__damage">
            <i class="fas fa-fire fa-fw"></i> <span>{damage || card.damage}</span>
          </div>

          {#if card.klass === 1}
            <div class="stat stat__solid">
              <i class="fas fa-shield-alt fa-fw"></i> <span>4</span>
            </div>
          {:else if card.klass === 2}
            <div class="stat stat__liquid">
              <i class="fas fa-tint fa-fw"></i> <span>4</span>
            </div>
          {:else if card.klass === 3}
            <div class="stat stat__gas">
              <i class="fas fa-radiation fa-fw"></i> <span>4</span>
            </div>
          {:else if card.klass === 4}
            <div class="stat stat__plasma" on:mousemove={passiveMouseMove}>
              <i class="fas fa-khanda fa-fw"></i> <span>4</span>

              <div class="tooltip2" bind:this={passiveTooltip}>
                {@html passives.find((passive) => passive.klass === card.klass).text}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>

    <div class="card--back">
      <img
        class="card--back__img"
        src="assets/card-backs/default.jpg"
        alt="Card back"
      />
    </div>
  </div>
</div>
