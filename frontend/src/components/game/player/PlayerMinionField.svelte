<script lang="ts">
  import {get} from "svelte/store";
  import {cards} from "data";
  import {socketService} from "services";
  import {game, selectedFieldCard, selectedHandCard} from "game/stores";
  import {CardComponent} from "components";
  import {CardType} from "enums";

  let field: string;

  const onPlayCard = (): void => {
    if ($selectedHandCard.type !== CardType.MINION) { return; }

    const {gid, id} = get(selectedHandCard);
    socketService.emit("playCard", {field: `minion${field}`, gid, id});

    selectedHandCard.update((store) => {
      store.gid = 0;
      store.id = 0;

      return store;
    });
  };

  const getCard = (field: string): any => {
    const card = cards.find(({id}) => id === $game.player.fields[field].id);
    const gid = $game.player.fields[field].gid;

    return {...card, gid};
  };

  const onAttackSelect = (): void => {
    if ($selectedFieldCard.field === field) {
      selectedFieldCard.set({
        field: ""
      });
    } else {
      selectedFieldCard.set({field});
    }
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .minionfield {
    height: $card-height;
    width: $card-width;
    @include d-flex(row, center, center);
    background-color: $orange;
    box-shadow: $elevation-sm;
    cursor: not-allowed;
  }

  .selected {
    box-shadow: 0 0 4px 2px $purple;
  }
  .summonable {
    animation: glow 1s ease-in-out infinite;
    cursor: pointer;
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
</style>

<div
  class="minionfield"
  class:summonable={$selectedHandCard.gid && $selectedHandCard.type === CardType.MINION}
  class:selected={$selectedFieldCard.field === field}
  on:click={onPlayCard}
>
  {#if field === "A"}
    {#if $game.player.fields.minionA}
      <div on:click={onAttackSelect}>
        <CardComponent
          card={getCard("minionA")}
          health={$game.player.fields.minionA.health}
          damage={$game.player.fields.minionA.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "B"}
    {#if $game.player.fields.minionB}
      <div on:click={onAttackSelect}>
        <CardComponent
          card={getCard("minionB")}
          health={$game.player.fields.minionB.health}
          damage={$game.player.fields.minionB.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "C"}
    {#if $game.player.fields.minionC}
      <div on:click={onAttackSelect}>
        <CardComponent
          card={getCard("minionC")}
          health={$game.player.fields.minionC.health}
          damage={$game.player.fields.minionC.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "D"}
    {#if $game.player.fields.minionD}
      <div on:click={onAttackSelect}>
        <CardComponent
          card={getCard("minionD")}
          health={$game.player.fields.minionD.health}
          damage={$game.player.fields.minionD.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {/if}
</div>
