<script lang="ts">
  import {CardComponent} from "components";
  import {cards} from "data";
  import {game, selectedHandCard} from "game/stores";
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

  .selected {animation: glow 900ms $ease-in-out-quart infinite}

  @keyframes glow {
    0%    {box-shadow: 0 0 8px 4px $orange}
    50%   {box-shadow: 0 0 10px 5px $orange}
    100%  {box-shadow: 0 0 8px 4px $orange}
  }

  .hand {
    display: flex;

    &__card {
      height: $card-height;
      width: $card-width;
      transition: transform 225ms $ease-in-out-quart;
    }
    &__card:hover {
      transform: translateY(-8px);
    }
    &__card:hover~&__card {
      transform: translateX(math.div($card-width, 2));
    }
    &__card:not(:first-child) {
      margin-left: math.div(-$card-width, 2);
    }
  }
</style>

<div class="hand">
  {#each $game.player.hand as {id, gid}}
    <div class="hand__card" class:selected={gid === $selectedHandCard.gid} on:click={() => selectCard(id, gid)}>
      <CardComponent card={getCard(id)}/>
    </div>
  {/each}
</div>
