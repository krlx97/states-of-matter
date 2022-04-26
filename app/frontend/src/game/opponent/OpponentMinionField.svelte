<script lang="ts">
  import {cards} from "@som/shared/data";
  import {socketService} from "services";
  import {gameStore, hoveredCardStore, playerStore, selectedCardStore} from "stores";
  import Card from "../../ui/CardSm.svelte";

  export let field: "a" | "b" | "c" | "d";

  $: minion = $gameStore.opponent.minion[field];
  $: isHovered = $hoveredCardStore.field === field;

  const getCard = (): any => {
    const {gid} = minion;
    const card = cards.find((card) => card.id === minion.id);

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

  .field {
    height: $card-height-sm;
    width: $card-width-sm;
    @include flex($align-items: center, $justify-content: center);
    box-shadow: $elevation-sm;
    cursor: not-allowed;
    transition: transform 225ms ease-in-out;
  }

  .isHovered {transform: translateY(-8px);}
</style>

{#if minion}
  <div class="field" class:isHovered on:click={onAttackCard}>
    <Card
      card={getCard()}
      health={minion.health}
      damage={minion.damage}
      isHealthBarVisible={true}
    />
  </div>
{:else}
  <div class="field">
    <span class="f--orange">Minion Field {field}</span>
  </div>
{/if}
