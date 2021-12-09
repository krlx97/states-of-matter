<script lang="ts">
  import {getContext, onMount} from "svelte";
  import type {Writable} from "svelte/store";

  let selectedCard: Writable<{gid: number; id: number}> = getContext("selectedCard");

  const selectCard = (): void => {
    if ($selectedCard.gid !== card.gid) {
      selectedCard.set({gid: card.gid, id: card.id});
    } else {
      selectedCard.set({gid: 0, id: 0});
    }
  };

  export let card: any = {};
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
  }
  .card__front, .card__back {
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
  }
  .card__front {
    background-color: rgb(var(--dark-grey));
    box-sizing: border-box;
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

  .tooltip {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    height: auto;
    width: 160px;
    padding: var(--spacing-sm);
    background-color: rgb(var(--light-grey));
    box-shadow: var(--elevation-lg);
  }

  .circle-stat-green,
  .circle-stat-orange,
  .circle-stat-red,
  .circle-stat-purple,
  .circle-stat-magic {
    position: absolute;
    height: 32px;
    width: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: var(--elevation-md);
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.6rem;
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


  .circle-stat-green {
    bottom: 0;
    right: 0;
    background-color: rgb(var(--green));
  }
  .circle-stat-orange {
    bottom: 0;
    left: 0;
    background-color: rgb(var(--orange));
  }
  .circle-stat-red {
    bottom: -5%;
    left: calc(50% - 40px / 2);
    background-color: rgb(var(--red));
    /* transform: translateX(-50%); */
  }
  .circle-stat-purple {
    top: 0;
    left: 0;
    background-color: rgb(var(--purple));
  }
  .circle-stat-magic {
    top: 0;
    right: 0;
    background-color: rgb(var(--purple));
  }
</style>

<div class="scene" on:click={selectCard}>
  <div class="card" class:selected={card.gid === $selectedCard.gid}>

    <div class="card__front">

      <main class="card__main">

        <img
          class="card__img"
          src="assets/cards/{card.klass}/{card.id}.jpg"
          alt={card.name}>

        {#if card.type === "Minion"}
          <div class="circle-stat-green" data-tooltip="Health">
            <div>
              <i class="fas fa-heart"></i>
            </div>
            <div>
              {card.stats.health}
            </div>
          </div>

          <div class="circle-stat-orange" data-tooltip="Damage">
            <div>
              <i class="fas fa-fire"></i>
            </div>
            <div>
              {card.stats.damage}
            </div>
          </div>
          {#if card.klass === 1}
            <div class="stat f--yellow">
              <i class="fas fa-shield-alt fa-fw"></i> {card.stats.damageReduction}%
            </div>
          {:else if card.klass === 2}
            <div class="stat f--purple">
              <i class="fas fa-tint"></i> {card.stats.absorbChance}%
            </div>
          {:else if card.klass === 3}
            <div class="stat f--orange">
              <i class="fas fa-radiation"></i> {card.stats.neurotoxin}%
            </div>
          {:else if card.klass === 4}
            <div class="circle-stat-red" data-tooltip="Double Damage Chance">
              <div>
                <i class="fas fa-khanda"></i>
              </div>
              <div>
                {card.stats.criticalChance}%
              </div>
            </div>
          {/if}
        {/if}
        <div class="circle-stat-purple">
          <i class="fas fa-star"></i>
        </div>

        <div class="circle-stat-magic">
          <i class="fas fa-magic"></i>

          <div class="tooltip">
            <div>
              {card.name}
            </div>
            <div>
              {@html card.effect}
            </div>
          </div>
        </div>

        <!-- <Tooltip title="Hello">
          
        </Tooltip> -->

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