<script lang="ts">
  import {cards} from "data";
  import {game, selectedFieldCard, selectedHandCard} from "game/stores";
  import {CardComponent} from "components";
  import {socketService} from "services";

  let field: string;

  const getCard = (field: string): any => {
    const card = cards.find(({id}) => id === $game.opponent.fields[field].id);
    const {gid} = $game.opponent.fields[field];

    return {...card, gid};
  };

  const onAttackCard = (): void => {
    socketService.emit("attackCard", {
      attacker: `minion${$selectedFieldCard.field}`,
      attacked: `minion${field}`
    });
  };

  export {field};
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

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
    {#if $game.opponent.fields.minionA}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionA")}
          health={$game.opponent.fields.minionA.health}
          damage={$game.opponent.fields.minionA.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "B"}
    {#if $game.opponent.fields.minionB}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionB")}
          health={$game.opponent.fields.minionB.health}
          damage={$game.opponent.fields.minionB.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "C"}
    {#if $game.opponent.fields.minionC}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionC")}
          health={$game.opponent.fields.minionC.health}
          damage={$game.opponent.fields.minionC.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {:else if field === "D"}
    {#if $game.opponent.fields.minionD}
      <div on:click={onAttackCard}>
        <CardComponent
          card={getCard("minionD")}
          health={$game.opponent.fields.minionD.health}
          damage={$game.opponent.fields.minionD.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  {/if}
</div>
