<script lang="ts">
  import {cards} from "data";
  import {gameStore, playerStore} from "stores/data";
  import Card from "../Card.svelte";

  $: isntCurrentPlayerA = $gameStore.playerA.username !== $playerStore.username;
  $: isntCurrentPlayerB = $gameStore.playerB.username !== $playerStore.username;

  let field: string;

  const getCard = (player: string, field: string): any => {
    const card = cards.find(({id}) => id === $gameStore[player].fields[field].id);
    const {gid} = $gameStore[player].fields[field];

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
    border: 1px solid rgb(var(--orange));
    box-sizing: border-box;
  }
</style>

<div class="minionfield">
  {#if field === "a"}
    {#if isntCurrentPlayerA && isntEmptyField("playerA", "minionA")}
      <Card card={getCard("playerA", "minionA")}/>
    {:else if isntCurrentPlayerB && isntEmptyField("playerB", "minionA")}
      <Card card={getCard("playerB", "minionA")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "b"}
    {#if isntCurrentPlayerA && isntEmptyField("playerA", "minionB")}
      <Card card={getCard("playerA", "minionB")}/>
    {:else if isntCurrentPlayerB && isntEmptyField("playerB", "minionB")}
      <Card card={getCard("playerB", "minionB")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "c"}
    {#if isntCurrentPlayerA && isntEmptyField("playerA", "minionC")}
      <Card card={getCard("playerA", "minionC")}/>
    {:else if isntCurrentPlayerB && isntEmptyField("playerB", "minionC")}
      <Card card={getCard("playerB", "minionC")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "d"}
    {#if isntCurrentPlayerA && isntEmptyField("playerA", "minionD")}
      <Card card={getCard("playerA", "minionD")}/>
    {:else if isntCurrentPlayerB && isntEmptyField("playerB", "minionD")}
      <Card card={getCard("playerB", "minionD")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {/if}
</div>