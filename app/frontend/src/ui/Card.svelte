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

  // .scene {
  //   perspective: 1280px;
  //   height: 100%;
  //   width: 100%;
  // }
  // .rotated {transform: rotateY(180deg)}

  .isNeutral {
    // box-shadow: 0 0 4px 0 rgb(253, 253, 253);
    color: rgb(253, 253, 253);
    box-sizing: border-box;
  }
  .isSolid {
    // box-shadow: 0 0 4px 0 rgb(255, 107, 107);
    color: rgb(255, 107, 107);
    box-sizing: border-box;
  }
  .isLiquid {
    // box-shadow: 0 0 4px 0 rgb(176, 230, 255);
    color: rgb(176, 230, 255);
    box-sizing: border-box;
  }
  .isGas {
    // box-shadow: 0 0 4px 0 rgb(168, 222, 84);
    color: rgb(168, 222, 84);
    box-sizing: border-box;
  }
  .isPlasma {
    // box-shadow: 0 0 4px 0 rgb(179, 104, 243);
    color: rgb(179, 104, 243);
    box-sizing: border-box;
  }

  .card {
    position: relative;
    // height: $card-height;
    // width: $card-width;
    height: 100%;
    width: 100%;
    transform-style: preserve-3d;
    transform-origin: center center;
    // box-shadow: $elevation-sm;
    transition: box-shadow 225ms ease-in-out, transform 450ms $ease-in-out-quart;

    &:hover {
      // box-shadow: $elevation-lg;
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
        width: $card-width;
      }
    }
    &--front {
      display: flex;
      flex-direction: column;
    }

    &__bar {
      position: absolute;
      bottom: 48px;
      left: 50%;
      width: 80%;
      box-shadow: $elevation-sm;
      transform: translateX(-50%);
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
</style>

<!-- <div class="scene" on:contextmenu|preventDefault={flip}> -->
  <div class="card" class:rotated={isFlipped}>
    <div class="card--front">
      <div class="card__header">

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

      </div>

      <Img src="cards/{card.klass}/{card.id}.jpg" alt={card.name}/>

      {#if isHealthBarVisible}
        <div class="card__bar">
          <ProgressBar progress={health / card.health * 100} color="green"/>
        </div>
      {/if}

      <div class="card__attrs">

        <div class="stat stat__mana">
          <Img src="attrs/manacost.png" alt="Mana Cost"/>
          <Text size="xsm">{card.manaCost}</Text>
        </div>

        {#if card.type === CardType.MINION}
          <div class="stat stat__health">
            <Img src="attrs/health.png" alt="Health"/>
            <Text size="xsm">{health || card.health}</Text>
          </div>

          <div class="stat stat__damage">
            <Img src="attrs/damage.png" alt="Damage"/>
            <Text size="xsm">{damage || card.damage}</Text>
          </div>

          <!-- {#if card.klass === 1}
            <div class="stat stat__solid" on:mousemove={passiveMouseMove}>
              <Img src="attrs/solid.png" alt="Solid"/>
              <Text>4</Text>

              <div class="tooltip2" bind:this={passiveTooltip}>
                {@html passives.find((passive) => passive.klass === card.klass).text}
              </div>
            </div>
          {:else if card.klass === 2}
            <div class="stat stat__liquid" on:mousemove={passiveMouseMove}>
              <i class="fas fa-tint fa-fw"></i> <span>4</span>

              <div class="tooltip2" bind:this={passiveTooltip}>
                {@html passives.find((passive) => passive.klass === card.klass).text}
              </div>
            </div>
          {:else if card.klass === 3}
            <div class="stat stat__gas" on:mousemove={passiveMouseMove}>
              <i class="fas fa-radiation fa-fw"></i> <span>4</span>

              <div class="tooltip2" bind:this={passiveTooltip}>
                {@html passives.find((passive) => passive.klass === card.klass).text}
              </div>
            </div>
          {:else if card.klass === 4}
            <div class="stat stat__plasma" on:mousemove={passiveMouseMove}>
              <i class="fas fa-khanda fa-fw"></i> <span>4</span>

              <div class="tooltip2" bind:this={passiveTooltip}>
                {@html passives.find((passive) => passive.klass === card.klass).text}
              </div>
            </div>
          {/if} -->
        {/if}
      </div>
    </div>

    <div class="card--back">
      <Img src="card-backs/default.jpg" alt="Card back"/>
    </div>
  </div>
<!-- </div> -->
