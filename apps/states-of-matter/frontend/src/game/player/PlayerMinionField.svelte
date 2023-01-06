<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {cards} from "@som/shared/data";
  import {socketService, soundService} from "services";
  import {floatingTextStore, gameStore, selectedCardStore, playerStore} from "stores";
  import FloatingText from "../FloatingText.svelte";
  import Card from "../../ui/Card.svelte";
    import { cardEffectNames } from "data";

  export let field: "a" | "b" | "c" | "d";

  const {socket} = socketService;

  $: isSelected = $selectedCardStore.field === field;
  $: isSummonable =
    $selectedCardStore.hand.gid &&
    $selectedCardStore.hand.type === CardType.MINION &&
    !$gameStore.player.minion[field];
  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;

  $: minion = $gameStore.player.minion[field];

  const getCard = (): any => {
    const card = cards.find(({id}) => id === minion.id);
    const gid = minion.gid;

    return {...card, gid};
  };

  const onPlayCard = (): void => {
    if (!isCurrentPlayer) { return; }
    if (!$selectedCardStore.hand.gid) { return; }
    if ($selectedCardStore.hand.type !== CardType.MINION) { return; }

    if ($selectedCardStore.field !== "") {
      $selectedCardStore.field = "";
    }

    const {gid} = $selectedCardStore.hand;

    socket.emit("playMinion", {field, gid});
    soundService.play("summon");

    $selectedCardStore.hand.gid = 0;
  };

  const onAttackSelect = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    if ($selectedCardStore.hand.gid) {
      $selectedCardStore.hand.gid = 0;
    }

    if ($selectedCardStore.field === field) {
      $selectedCardStore.field = "";
    } else {
      $selectedCardStore.field = field;
    }
  };

  const onMouseenter = (): void => {
    if (isCurrentPlayer) {
      socket.emit("hoverCard", {field});
    }
  }

  const onMouseleave = (): void => {
    if (isCurrentPlayer) {
      socket.emit("unhoverCard");
    }
  }
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
    border: 2px ridge rgb(96, 133, 29);
    /* box-shadow: var(--elevation-md); */
    border-radius: 8px;
    backdrop-filter: blur(2px);
  }

  .buffs-icon {
    position: absolute;
    top: -24px;
    left: 50%;
    height: 24px;
    width: 24px;
    transform: translateX(-50%);
    z-index: 10;
    background-color: rgb(47, 47, 47);
    border-radius: 50%;
  }

  .buffs {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: 144px;
    text-align: center;
    display: none;
    background-color: rgb(47, 47, 47);
    border-radius: 8px;
    line-height: 1.4;
  }

  .buffs-icon:hover .buffs {
    display: initial;
  }

  .buff {color: rgb(var(--green));}
  .debuff {color: rgb(var(--red));}

  .field:hover {
    /* transform: translateY(-8px); */
  }

  .isSelected {
    box-shadow: 0 0 0 4px white;
  }

  .isSummonable {
    animation: glow 1s cubic-bezier(var(--ease-in-out-quart)) infinite;
    cursor: pointer;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 4px 2px rgb(var(--orange));
    } 50% {
      box-shadow: 0 0 8px 4px rgb(var(--orange));
    } 100% {
      box-shadow: 0 0 4px 2px rgb(var(--orange));
    }
  }
</style>

<div class="field" on:mouseenter={onMouseenter} on:mouseleave={onMouseleave}>
  {#each $floatingTextStore.player[field] as text}
    <FloatingText {text}/>
  {/each}
  {#if minion}
    <div class:isSelected on:click={onAttackSelect} on:keypress={onAttackSelect}>
      <div class="buffs-icon">
        <img src="assets/buffs.png" height="24" width="24"/>
        <div class="buffs">
          {#each minion.buffs as buff}
            <div class="buff">{cardEffectNames.get(buff)}</div>
          {/each}
          <div class="buff">Buff2</div>
          {#each minion.debuffs as debuff}
            <div class="debuff">{cardEffectNames.get(debuff)}</div>
          {/each}
          <div class="debuff">Debuff2</div>
          <div class="debuff">Debuff3</div>
        </div>
      </div>
      <Card card={getCard()} health={minion.health} damage={minion.damage} isClient={false}/>
    </div>
  {:else}
    <div class:isSummonable on:click={onPlayCard} on:keypress={onPlayCard}>
      <span>Minion Field {field}</span>
    </div>
  {/if}
</div>
