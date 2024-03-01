<script lang="ts">
  import {onMount} from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { Ability, CardId, CardType } from "@som/shared/enums";
  import {socketService} from "services";
  import {floatingTextStore, gameStore, nodeStore, playerStore, selectedCardStore} from "stores";
  import {CardComponent, TextComponent} from "ui";
  import type {MinionField} from "@som/shared/types/mongo";
    import { cardEffectNames } from "@som/shared/data";

  let field: MinionField;
  let fieldElement: HTMLDivElement;
  let damageDealtElement: HTMLDivElement;

  $: minion = $gameStore.opponent.field[field];

  $: isAttackable =
    $selectedCardStore.field !== undefined &&
    $selectedCardStore.field !== "hero" &&
    minion !== undefined;

  $: isTargetable =
    (
      $selectedCardStore.hand &&
      $selectedCardStore.hand.id === CardId.CROSS
    ) || (
      $selectedCardStore.field === "hero" &&
      (
        $gameStore.player.field.hero.ability === Ability.NEUROTOXIN ||
        $gameStore.player.field.hero.ability === Ability.OVERCHARGE
      )
    );

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) {
      return;
    }

    if ($selectedCardStore.field === "hero" && ($gameStore.player.field.hero.ability === Ability.NEUROTOXIN || $gameStore.player.field.hero.ability === Ability.OVERCHARGE)) {
      socketService.socket.emit("useAbility" as any, {
        target: field
      });
    } else if ($selectedCardStore.field === "hero") {
      return;
    } else if ($selectedCardStore.field) {
      const attacked = field;
      const attacker = $selectedCardStore.field;

      socketService.socket.emit("attackMinion", {attacked, attacker});

      $selectedCardStore.field = undefined;
    } else if ($selectedCardStore.hand && $selectedCardStore.hand.id === CardId.CROSS) {
      socketService.socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field
      });

      $selectedCardStore.hand = undefined;
    }
  };

  onMount((): void => {
    // $nodeStore.opponent[field] = fieldElement;
    $nodeStore.opponent[`${field}Damage`] = damageDealtElement;
  });

  const summon = (eleme) => {
    $nodeStore.opponent[field] = eleme;
  };

  export {field};
</script>

<style>
  .field {
    position: relative;
    height: calc(var(--card-height) + 2px);
    width: calc(var(--card-width) + 2px);
    background-color: rgba(var(--dark-grey), 0.666);
    cursor: not-allowed;
    border-radius: 8px;
  }

  .damage-dealt {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(var(--dark-grey), 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: rgb(var(--warn));
    font-size: 128px;
    visibility: hidden;
    z-index: 5;
    pointer-events: none;
  }

  .field-empty {
    position: absolute;
    height: 100%;
    width: 100%;
    border: 1px solid rgba(var(--grey), 0.333);
    border-radius: 8px;
    box-sizing: border-box;
  }

.floating-text {
    position: absolute;
    width: calc(var(--card-width) - 32px);
    height: 16px;
    bottom: calc(64px + 24px);
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    font-size: var(--xs);
    transform: translateX(-50%);
    z-index: 1000;
  }

.buffs {
    position: absolute;
    top: calc(100% + 16px);
    left: 50%;
    transform: translateX(-50%);
    width: 144px;
    text-align: center;
    display: flex;
    flex-direction: column;
    background-color: rgb(47, 47, 47);
    border-radius: 8px;
    line-height: 1.25;
  }

  .canAttack {
    position: absolute;
    bottom: calc(100%);
    left: -5%;
    animation: pop 1s linear infinite alternate;
  }

  @keyframes pop {
    from {transform: scale(1)}
    to {transform: scale(1.5);}
  }
</style>

<div
  class="field"
  bind:this="{fieldElement}"
  style={field === "a" ? "z-index: 1" : field === "b" ? "z-index: 2" : field === "c" ? "z-index: 3" : "z-index: 4"}>
  <div class="damage-dealt" bind:this={damageDealtElement}></div>

  {#if minion}

    {#if $floatingTextStore.opponent[field]}
      <div class="floating-text" in:fly={{y: 64, duration: 1000, opacity: 1}}>
        {$floatingTextStore.opponent[field]}
      </div>
    {/if}

    {#if !minion.canAttack}
      <div class="canAttack">💤</div>
    {/if}

    <div class="buffs">
      {#each minion.buffs as {id, data}}
        <TextComponent color="success">
          {cardEffectNames.get(id)} {#if data}({Object.values(data)}){/if}
        </TextComponent>
      {/each}
      {#each minion.debuffs as {id, data}}
        <TextComponent color="warn">
          {cardEffectNames.get(id)} {#if data}({Object.values(data)}){/if}
        </TextComponent>
      {/each}
    </div>

    <div
      use:summon
      in:scale="{{start: 8, duration: 333, opacity: 0}}">
      <CardComponent {isAttackable} {isTargetable} card={minion} isOpponent on:click={onAttackCard}/>
    </div>

  {:else}
    <div class="field-empty"></div>
  {/if}

</div>
