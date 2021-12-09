<script lang="ts">
  import type {Card} from "models/view";

  let card: Card;
  $: borderr = "";

  const getBorder = (): string => {
    if (card.type === 0) {
      return "border-top: 2px solid orange;";
    } else if (card.type === 1) {
      return "border-top: 2px solid green;";
    } else {
      return "border-top: 2px solid red;";
    }
  };

  export {card};
</script>

<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .scene {
    /* margin: 0 0 var(--spacing-md) var(--spacing-md); */
    perspective: 1280px;
  }

  /* .selected {
    border: 2px solid red;
  } */
  .selected {
    animation: glow 1s ease-in-out infinite;
  }
  @keyframes glow {
    0% {
      box-shadow: 0 0 0 0 rgb(var(--orange));
    } 50% {
      box-shadow: 0 0 4px 2px rgb(var(--orange));
    } 100% {
      box-shadow: 0 0 0 0 rgb(var(--orange));
    }
  }

  .card {
    height: $game-field-height;
    width: $game-field-width;
    position: relative;
    transform-style: preserve-3d;
    transform-origin: center right;
    transition: transform 1s linear;
    box-shadow: var(--elevation-sm);
    box-sizing: border-box;
  }
  .card__front, .card__back {
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
  }
  .card__front {
    background-color: rgb(var(--dark-grey));
   
  }
  .card__back { transform: rotateY(-180deg); }
  .card__back__img {
    height: $game-field-height;
    width: $game-field-width;
  }

  .card__main {
    position: relative;
    margin-bottom: var(--spacing-sm);
  }
  .card__img {
    display: block;
    height: $game-field-height;
    width: $game-field-width;
  }
  /* .card__footer {
    padding: var(--spacing-sm);
    height: 64px;
    overflow-y: scroll;
    background-color: rgb(var(--light-grey));
    font-size: 0.75rem;
    box-sizing: border-box;
    box-shadow: var(--elevation-sm);
  }
  .card__footer::-webkit-scrollbar {
    width: 8px;
    background-color: rgb(var(--light-grey));
    border-radius: 8px;
  }
  .card__footer::-webkit-scrollbar-thumb {
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
  } */



  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translateZ(8px);
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
    background-color: rgba(var(--light-grey), 0.9);
    box-shadow: var(--elevation-lg);
    font-size: 12px;
  }

  .stat {
    position: absolute;
    height: 32px;
    width: 32px;
    @include d-flex(column, center, center);
    background-color: rgba(var(--dark-grey), 0.5);
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: var(--elevation-md);
    font-size: $font-sm;

    &__damage {
      bottom: 4px;
      left: 4px;
      border: 2px solid $orange;
    }

    &__health {
      bottom: 4px;
      right: 4px;
      border: 2px solid $green;
    }

    &__solid, &__liquid, &__gas, &__plasma, &__neutral {
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
    }
    &__solid { border: 2px solid $solid; }
    &__liquid { border: 2px solid $liquid; }
    &__gas { border: 2px solid $gas; }
    &__plasma { border: 2px solid $plasma; }
    &__neutral { border: 2px solid $light-grey; }
  }

  .circle-stat-green,
  .circle-stat-orange,
  .circle-stat-red,
  .circle-stat-purple,
  .circle-stat-grey,
  .circle-stat-blue {
    position: absolute;
    height: 32px;
    width: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--dark-grey), 0.5);
    box-shadow: var(--elevation-md);
    border-radius: 50%;
    cursor: pointer;
    font-size: $font-sm;
  }

  .circle-stat-magic:hover .tooltip {
    display: initial;
  }

  /* .circle-stat-green:hover .tooltip,
  .circle-stat-orange:hover .tooltip,
  .circle-stat-red:hover .tooltip,
  .circle-stat-purple:hover .tooltip,
  .circle-stat-magic:hover .tooltip {
    display: initial;
  } */

  $stat-dimension: 32px;

  
  .circle-stat-green {
    bottom: 4px;
    right: 4px;
    border: 2px solid $green;
  }
  .circle-stat-orange {
    bottom: 4px;
    left: 4px;
    border: 2px solid $orange;
  }
  .circle-stat-red {
    bottom: -5%;
    left: calc(50% - 40px / 2);
    background-color: rgb(var(--red));
    /* transform: translateX(-50%); */
  }
  .circle-stat-grey {
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid $light-grey;
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
</style>

<div class="scene">
  <div class="card" >

    <div class="card__front">

      <main class="card__main">

        <div class="header" style={getBorder()}>
          <span>{card.name}</span>

          <div class="f--blue">
            <i class="fas fa-battery-half fa-fw"></i> 7
          </div>
          <!-- <i class="fas fa-star fa-fw"></i> -->

          <div class="tooltip">
            {@html card.effect}
          </div>
        </div>

        <img
          class="card__img"
          src="assets/cards/{card.klass}/{card.id}.jpg"
          alt={card.name}>

        {#if card.type === 0}
          <div class="stat stat__health">
            <div>
              <i class="fas fa-heart"></i>
            </div>
            <div>
              {card.health}
            </div>
          </div>

          <div class="stat stat__damage">
            <div>
              <i class="fas fa-fire"></i>
            </div>
            <div>
              {card.damage}
            </div>
          </div>

          {#if card.klass === 1}
            <div class="stat stat__solid">
              <i class="fas fa-shield-alt fa-fw"></i>
            </div>
          {:else if card.klass === 2}
            <div class="stat stat__liquid">
              <i class="fas fa-tint"></i>
            </div>
          {:else if card.klass === 3}
            <div class="stat stat__gas">
              <i class="fas fa-radiation"></i>
            </div>
          {:else if card.klass === 4}
            <div class="stat stat__plasma">
              <div>
                <i class="fas fa-khanda"></i>
              </div>
            </div>
          {:else if card.klass === 0}
            <div class="stat stat__neutral">
              <i class="fas fa-times fa-fw"></i>
            </div>
          {/if}
        {/if}

        <!-- <div class="circle-stat-blue">
          <div>
            <i class="fas fa-battery-half"></i>
          </div>
          <div>
            7
          </div>
        </div> -->

      </main>

      <!-- <footer class="card__footer">
        
      </footer> -->

    </div>

    <div class="card__back">
      <img
        class="card__back__img"
        src="assets/card-backs/default.jpg"
        alt="Card back">
    </div>

  </div>
</div>