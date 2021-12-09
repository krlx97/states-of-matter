<script lang="ts">
  import {getContext} from "svelte";
  import {get, Writable} from "svelte/store";
  import {cards} from "data";
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores/data";
  import {Card} from "components";

  $: isCurrentPlayerA = $gameStore.playerA.username === $playerStore.username;
  $: isCurrentPlayerB = $gameStore.playerB.username === $playerStore.username;

  let selectedCard: Writable<{gid: number; id: number}> = getContext("selectedCard");
  let field: string;

  const onPlayCard = (): void => {
    const {gid, id} = get(selectedCard);
    socketService.emit("playCard", {field: `field_${field}`, gid, id});
  };

  const getCard = (player: string, field: string): any => {
    const card = cards.find(({id}) => id === $gameStore[player].fields[field].id);
    const gid = $gameStore[player].fields[field].gid;

    return {...card, gid};
  };

  const isntEmptyField = (player: string, field: string): boolean => {
    return $gameStore[player].fields[field].gid !== 0;
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .minionfield {
    height: $game-field-height;
    width: $game-field-width;
    @include d-flex(row, center, center);
    background-color: $orange;
    box-shadow: $elevation-sm;
    cursor: not-allowed;
  }

  .summonable {
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
</style>

<div class="minionfield" on:click={onPlayCard} class:summonable={$selectedCard.gid !== 0}>
  {#if field === "a"}
    {#if isCurrentPlayerA && isntEmptyField("playerA", "minionA")}
      <Card card={getCard("playerA", "minionA")}/>
    {:else if isCurrentPlayerB && isntEmptyField("playerB", "minionA")}
      <Card card={getCard("playerB", "minionA")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}
  {:else if field === "b"}

    {#if isCurrentPlayerA && isntEmptyField("playerA", "minionB")}
      <Card card={getCard("playerA", "minionB")}/>
    {:else if isCurrentPlayerB && isntEmptyField("playerB", "minionB")}
      <Card card={getCard("playerB", "minionB")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}

  {:else if field === "c"}

    {#if isCurrentPlayerA && isntEmptyField("playerA", "minionC")}
      <Card card={getCard("playerA", "minionC")}/>
    {:else if isCurrentPlayerB && isntEmptyField("playerB", "minionC")}
      <Card card={getCard("playerB", "minionC")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}

  {:else if field === "d"}

    {#if isCurrentPlayerA && isntEmptyField("playerA", "minionD")}
      <Card card={getCard("playerA", "minionD")}/>
    {:else if isCurrentPlayerB && isntEmptyField("playerB", "minionD")}
      <Card card={getCard("playerB", "minionD")}/>
    {:else}
      <span>Minion Field {field}</span>
    {/if}

  {/if}
</div>