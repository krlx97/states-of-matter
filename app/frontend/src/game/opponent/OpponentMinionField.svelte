<script lang="ts">
  import {cards} from "@som/shared/data";
  import {socketService} from "services";
  import {gameStore, hoveredCardStore, selectedCardStore, playerStore} from "stores";
  import Card from "../../ui/CardSm.svelte";

  export let field: "a" | "b" | "c" | "d";

  $: isHovered = field === $hoveredCardStore.field;

  const getCard = (field: string): any => {
    const card = cards.find(({id}) => id === $gameStore.opponent.fields[field].id);
    const {gid} = $gameStore.opponent.fields[field];

    return {...card, gid};
  };

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }
    if (!$selectedCardStore.field) { return; }

    const attacked = field;
    const attacker = $selectedCardStore.field;

    socketService.socket.emit("attackMinion", {attacked, attacker});
  };
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .isHovered {box-shadow: 0 0 4px 8px white;}

  .field {
    height: $card-height-sm;
    width: $card-width-sm;
    @include flex($align-items: center, $justify-content: center);
    box-shadow: $elevation-sm;
    cursor: not-allowed;
  }
</style>

{#if field === "a"}
  <div class="field" class:isHovered>
    {#if $gameStore.opponent.fields.minionA}
      <div style="height: 100%; width: 100%;" on:click={onAttackCard}>
        <Card
          card={getCard("minionA")}
          health={$gameStore.opponent.fields.minionA.health}
          damage={$gameStore.opponent.fields.minionA.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  </div>
{:else if field === "b"}
  <div class="field" class:isHovered>
    {#if $gameStore.opponent.fields.minionB}
      <div style="height: 100%; width: 100%;" on:click={onAttackCard}>
        <Card
          card={getCard("minionB")}
          health={$gameStore.opponent.fields.minionB.health}
          damage={$gameStore.opponent.fields.minionB.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  </div>
{:else if field === "c"}
  <div class="field" class:isHovered>
    {#if $gameStore.opponent.fields.minionC}
      <div style="height: 100%; width: 100%;" on:click={onAttackCard}>
        <Card
          card={getCard("minionC")}
          health={$gameStore.opponent.fields.minionC.health}
          damage={$gameStore.opponent.fields.minionC.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  </div>
{:else if field === "d"}
  <div class="field" class:isHovered>
    {#if $gameStore.opponent.fields.minionD}
      <div style="height: 100%; width: 100%;" on:click={onAttackCard}>
        <Card
          card={getCard("minionD")}
          health={$gameStore.opponent.fields.minionD.health}
          damage={$gameStore.opponent.fields.minionD.damage}
          isHealthBarVisible={true}
        />
      </div>
    {:else}
      <span class="f--orange">Minion Field {field}</span>
    {/if}
  </div>
{/if}
