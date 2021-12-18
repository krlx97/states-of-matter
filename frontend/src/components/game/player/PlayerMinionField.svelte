<script lang="ts">
  import {get} from "svelte/store";
  import {cards} from "data";
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores/data";
  import {selectedHandCard} from "../stores";
  import {CardComponent} from "components";
  import {CardType} from "enums";

  $: isCurrentPlayerA = $gameStore.playerA.username === $playerStore.username;
  $: isCurrentPlayerB = $gameStore.playerB.username === $playerStore.username;

  let field: string;

  const onPlayCard = (): void => {
    const {gid, id} = get(selectedHandCard);
    socketService.emit("playCard", {field: `minion${field}`, gid, id});
  };

  const getCard = (player: string, field: string): any => {
    const card = cards.find(({id}) => id === $gameStore[player].fields[field].id);
    const gid = $gameStore[player].fields[field].gid;

    return {...card, gid};
  };

  $: _isntEmptyField = $gameStore

  const isntEmptyField = (player: string, field: string): boolean => {
    return $gameStore[player].fields[field].gid !== 0;
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .minionfield {
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    @include d-flex(row, center, center);
    background-color: $orange;
    box-shadow: $elevation-sm;
    cursor: not-allowed;
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
  class:summonable={$selectedHandCard.gid !== 0 && $selectedHandCard.type === CardType.MINION}
  on:click={onPlayCard}>
  {#if field === "A"}
    {#if isCurrentPlayerA && $gameStore.playerA.fields.minionA.gid !== 0}
      <CardComponent card={getCard("playerA", "minionA")}/>
    {:else if isCurrentPlayerB && $gameStore.playerB.fields.minionA.gid !== 0}
      <CardComponent card={getCard("playerB", "minionA")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "B"}
    {#if isCurrentPlayerA && $gameStore.playerA.fields.minionB.gid !== 0}
      <CardComponent card={getCard("playerA", "minionB")}/>
    {:else if isCurrentPlayerB && $gameStore.playerB.fields.minionB.gid !== 0}
      <CardComponent card={getCard("playerB", "minionB")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "C"}
    {#if isCurrentPlayerA && $gameStore.playerA.fields.minionC.gid !== 0}
      <CardComponent card={getCard("playerA", "minionC")}/>
    {:else if isCurrentPlayerB && $gameStore.playerB.fields.minionC.gid !== 0}
      <CardComponent card={getCard("playerB", "minionC")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "D"}
    {#if isCurrentPlayerA && $gameStore.playerA.fields.minionD.gid !== 0}
      <CardComponent card={getCard("playerA", "minionD")}/>
    {:else if isCurrentPlayerB && $gameStore.playerB.fields.minionD.gid !== 0}
      <CardComponent card={getCard("playerB", "minionD")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {/if}
</div>
