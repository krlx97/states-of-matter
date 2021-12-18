<script lang="ts">
  import {CardComponent} from "components";
  import {cards} from "data";
  import {gameStore, playerStore} from "stores/data";
  import {selectedHandCard} from "../stores";
  import {CardType} from "enums";

  const selectCard = (id: number, gid: number): void => {
    const card = getCard(id);

    if ($selectedHandCard.gid !== gid) {
      selectedHandCard.set({
        gid,
        id,
        type: card.type
      });
    } else {
      selectedHandCard.set({
        gid: 0,
        id: 0,
        type: CardType.MINION
      });
    }
  };

  const getCard = (id: number): any => cards.find((card) => card.id === id);
</script>

<style lang="scss">
  @use "sass:math";
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .selected {
    // animation: glow 1s ease-in-out infinite;
    box-shadow: 0 0 4px 2px $orange;
  }
  @keyframes glow {
    0% { box-shadow: 0 0 0 0 $orange; }
    50% { box-shadow: 0 0 4px 2px $orange; }
    100% { box-shadow: 0 0 0 0 $orange; }
  }

  .player__hand {
    display: flex;
  }
  .player__hand__card {
    height: $game-card-height;
    width: $game-card-width;
    transition: transform 225ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
  .player__hand__card:hover {
    transform: translateY(-8px);
  }
  .player__hand__card:hover~.player__hand__card {
    transform: translateX(math.div($game-card-width, 2));
  }
  .player__hand__card:not(:first-child) {
    margin-left: math.div(-$game-card-width, 2);
  }
</style>

<div class="player__hand">
  {#if $gameStore.playerA.username === $playerStore.username}
    {#each $gameStore.playerA.hand as {id, gid}}
      <div
        class="player__hand__card"
        on:click={() => selectCard(id, gid)}
        class:selected={gid === $selectedHandCard.gid}>
        <CardComponent card={getCard(id)}/>
      </div>
    {/each}
  {:else if $gameStore.playerB.username === $playerStore.username}
    {#each $gameStore.playerB.hand as {id, gid}}
      <div class="player__hand__card" on:click={() => selectCard(id, gid)} class:selected={gid === $selectedHandCard.gid}>
        <CardComponent card={getCard(id)}/>
      </div>
    {/each}
  {/if}
</div>
