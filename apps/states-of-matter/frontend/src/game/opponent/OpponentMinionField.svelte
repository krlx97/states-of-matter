<script lang="ts">
  import {cards} from "@som/shared/data";
  import {socketService} from "services";
  import {floatingTextStore, gameStore, hoveredCardStore, playerStore, selectedCardStore} from "stores";
  import FloatingText from "../FloatingText.svelte";
  import Card from "../../ui/Card.svelte";
    import { cardEffectNames } from "data";

  export let field: "a" | "b" | "c" | "d";

  $: minion = $gameStore.opponent.minion[field];
  $: isHovered = $hoveredCardStore.field === field;

  const getCard = (): any => {
    const {gid} = minion;
    const card = cards.find((card) => card.id === minion.id);

    return {...card, gid};
  };

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if (!$selectedCardStore.field) { return; }

    const attacked = field;
    const attacker = $selectedCardStore.field;

    socketService.socket.emit("attackMinion", {attacked, attacker});
  };
</script>

<style>
  .field {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    transition: transform 225ms ease-in-out;

    background: linear-gradient(90deg, rgba(31,31,31,0.2) 0%, rgba(121,108,254,0.2) 50%, rgba(31,31,31,0.2) 100%);
    border: 2px solid rgb(96, 133, 29);
    border-radius: 8px;
    backdrop-filter: blur(2px);

  }

  .buffs {
    position: absolute;
    top: -24px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .buff {color: rgb(var(--green));}
  .debuff {color: rgb(var(--red));}

  .isHovered {
    transform: translateY(-8px);
  }
</style>

<div class="field">
  {#each $floatingTextStore.opponent[field] as text}
    <FloatingText {text}/>
  {/each}
  {#if minion}
    <div class:isHovered on:click={onAttackCard} on:keypress={onAttackCard}>
      <div class="buffs">
        {#each minion.buffs as buff}
          <div class="buff">{cardEffectNames.get(buff)}</div>
        {/each}
        {#each minion.debuffs as debuff}
          <div class="debuff">{cardEffectNames.get(debuff)}</div>
        {/each}
      </div>
      <Card card={getCard()} health={minion.health} damage={minion.damage} isClient={false} isOpponent/>
    </div>
  {:else}
    <span>Minion Field {field}</span>
  {/if}
</div>
