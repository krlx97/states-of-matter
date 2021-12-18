<script lang="ts">
  import {cards} from "data";
  import {gameStore, playerStore} from "stores/data";
  import {CardComponent} from "components";

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
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    @include d-flex(row, center, center);
    border: 1px solid rgb(var(--orange));
    box-sizing: border-box;
  }
</style>

<div class="minionfield">
  {#if field === "A"}
    {#if isntCurrentPlayerA && $gameStore.playerA.fields.minionA.gid !== 0}
      <CardComponent card={getCard("playerA", "minionA")}/>
    {:else if isntCurrentPlayerB && $gameStore.playerB.fields.minionA.gid !== 0}
      <CardComponent card={getCard("playerB", "minionA")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "B"}
    {#if isntCurrentPlayerA && $gameStore.playerA.fields.minionB.gid !== 0}
      <CardComponent card={getCard("playerA", "minionB")}/>
    {:else if isntCurrentPlayerB && $gameStore.playerB.fields.minionB.gid !== 0}
      <CardComponent card={getCard("playerB", "minionB")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "C"}
    {#if isntCurrentPlayerA && $gameStore.playerA.fields.minionC.gid !== 0}
      <CardComponent card={getCard("playerA", "minionC")}/>
    {:else if isntCurrentPlayerB && $gameStore.playerB.fields.minionC.gid !== 0}
      <CardComponent card={getCard("playerB", "minionC")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "D"}
    {#if isntCurrentPlayerA && $gameStore.playerA.fields.minionD.gid !== 0}
      <CardComponent card={getCard("playerA", "minionD")}/>
    {:else if isntCurrentPlayerB && $gameStore.playerB.fields.minionD.gid !== 0}
      <CardComponent card={getCard("playerB", "minionD")}/>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {/if}
</div>
