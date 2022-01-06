<script lang="ts">
  import {cards} from "data";
  import {gameStore, selectedCardStore} from "game/stores";
  import {CardComponent} from "components";
  import {socketService} from "services";
import { playerStore } from "stores/data";

  let field: string;

  const getCard = (field: string): any => {
    const card = cards.find(({id}) => id === $gameStore.opponent.fields[field].id);
    const {gid} = $gameStore.opponent.fields[field];

    return {...card, gid};
  };

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }

    let attacker: string;
    const attacked = `minion${field}`;

    if ($selectedCardStore.field === "hero") {
      attacker = "hero";
    } else {
      attacker = `minion${$selectedCardStore.field}`;
    }

    socketService.emit("attackCard", {attacker, attacked});
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../../styles/mixins";
  @import "../../../../styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include d-flex(row, center, center);
    border: 1px solid $orange;
    box-sizing: border-box;
    cursor: not-allowed;
  }
</style>

<div class="field">
  {#if field === "A"}
    {#if $gameStore.opponent.fields.minionA}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionA")}
          health={$gameStore.opponent.fields.minionA.health}
          damage={$gameStore.opponent.fields.minionA.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "B"}
    {#if $gameStore.opponent.fields.minionB}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionB")}
          health={$gameStore.opponent.fields.minionB.health}
          damage={$gameStore.opponent.fields.minionB.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "C"}
    {#if $gameStore.opponent.fields.minionC}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionC")}
          health={$gameStore.opponent.fields.minionC.health}
          damage={$gameStore.opponent.fields.minionC.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "D"}
    {#if $gameStore.opponent.fields.minionD}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionD")}
          health={$gameStore.opponent.fields.minionD.health}
          damage={$gameStore.opponent.fields.minionD.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {/if}
</div>
