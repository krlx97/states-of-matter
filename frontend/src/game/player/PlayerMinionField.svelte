<script lang="ts">
  import {Ability, CardId, CardType, EffectId} from "@som/shared/enums";
  import {cardEffectNames, cards} from "@som/shared/data";
  import {socketService, soundService} from "services";
  import {floatingTextStore, gameStore, selectedCardStore, playerStore, nodeStore} from "stores";
  import {CardComponent, TextComponent} from "ui";
  import {onMount} from "svelte";
  import { fade, fly, scale } from "svelte/transition";

  const {socket} = socketService;

  let field: "a" | "b" | "c" | "d";
  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  $: isSelected = $selectedCardStore.field === field;

  $: isSummonable = (
    $selectedCardStore.hand &&
    $selectedCardStore.hand.gid &&
    $selectedCardStore.hand.type === CardType.MINION &&
    !$gameStore.player.field[field] ) || (
    $selectedCardStore.hand && $selectedCardStore.hand.id === CardId.GRAVECALL &&
    $selectedCardStore.graveyard && $selectedCardStore.graveyard.type === CardType.MINION);

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;
  $: card = $gameStore.player.field[field];

  $: isTargetable =
    ($selectedCardStore.hand && $selectedCardStore.hand.id === CardId.QUICK_SAND) ||
    ($selectedCardStore.field === "hero" && ($gameStore.player.field.hero.ability === Ability.FORTIFY || $gameStore.player.field.hero.ability === Ability.HEAL));

  $: blazeBuff = card?.buffs.find((buff): boolean => buff.id === EffectId.BLAZE)
  $: isGrayscale =
    // card &&
    // !card.canAttack &&
    // card.buffs.find((buff): boolean => buff.id === EffectId.BLAZE)?.data.hasAttackedTwice === true
    (
      card &&
      !card.canAttack &&
      !blazeBuff
    ) || (
      card &&
      !card.canAttack &&
      blazeBuff &&
      blazeBuff.data.hasAttackedTwice === true
    );

  const onEmptyFieldClick = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    if ($selectedCardStore.field !== undefined) {
      $selectedCardStore.field = undefined;
    }

    if (
      $selectedCardStore.hand &&
      $selectedCardStore.hand.id === CardId.GRAVECALL &&
      $selectedCardStore.graveyard &&
      $selectedCardStore.graveyard.type === CardType.MINION
    ) {
      socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field,
        target: $selectedCardStore.graveyard.gid
      });
    } else {
    if (!$selectedCardStore.hand.gid) { return; }

      const {gid} = $selectedCardStore.hand;
      socket.emit("playMinion", {field, gid});
    }

    $selectedCardStore.hand = undefined;
  };

  const onMinionFieldClick = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    if (isGrayscale && $selectedCardStore.field !== "hero") {
      return;
    }

    if ($selectedCardStore.field === "hero" && ($gameStore.player.field.hero.ability === Ability.FORTIFY || $gameStore.player.field.hero.ability === Ability.HEAL)) {
      $selectedCardStore.field = undefined;
      socket.emit("useAbility" as any, {
        target: field
      });
    } else if (
      $selectedCardStore.hand &&
      $selectedCardStore.hand.id === CardId.QUICK_SAND
    ) {
      socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field
      });
      $selectedCardStore.hand = undefined;
    } else if ($selectedCardStore.field === field) {
      $selectedCardStore.field = undefined;
    } else if ($selectedCardStore.hand) {
      $selectedCardStore.hand = undefined;
      $selectedCardStore.field = field;
    } else {
      $selectedCardStore.field = field;
    }
  };

  onMount((): void => {
    // $nodeStore.player[field] = fieldElement;
    $nodeStore.player[`${field}Damage`] = damageDealtElement;
  });

  const summon = (eleme) => {
    $nodeStore.player[field] = eleme;
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

  .isSummonable {
    position: relative;
    cursor: pointer;
    animation: borderGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  .isSummonable::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 16px 1px rgb(var(--success));
    opacity: 0;
    animation: shadowGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes shadowGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  @keyframes borderGlow {
    from {border-color: rgba(var(--grey), 0.333);}
    to {border-color: rgba(var(--success), 0.666);}
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

 .buffs {
    position: absolute;
    bottom: calc(100% + 16px);
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

  /* .kard {
    position: absolute;
    top: 0;
    left: 0;
  } */
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="field" bind:this="{fieldElement}">

  <div class="damage-dealt" bind:this="{damageDealtElement}"></div>

  {#if card}
    {#if $floatingTextStore.player[field]}
      <div class="floating-text" in:fly={{y: 64, duration: 1000, opacity: 1}}>
        {$floatingTextStore.player[field]}
      </div>
    {/if}

    {#if !card.canAttack}
      <div class="canAttack">💤</div>
    {/if}

    <div class="buffs">
      {#each card.buffs as {id, data}}
        <TextComponent color="success">
          {cardEffectNames.get(id)} {#if data}({Object.values(data)}){/if}
        </TextComponent>
      {/each}
      {#each card.debuffs as {id, data}}
        <TextComponent color="warn">
          {cardEffectNames.get(id)} {#if data}({Object.values(data)}){/if}
        </TextComponent>
      {/each}
    </div>

    <div use:summon in:scale="{{duration: 333, opacity: 0, start: 4}}">
      <!-- out:fade="{{duration: 333}}" -->
      <CardComponent
        {isGrayscale}
        {isSelected}
        isFriendlyTargetable={isTargetable}
        {card}
        on:click="{onMinionFieldClick}"/>
    </div>

  {:else}
    <div
      class="field-empty"
      class:isSummonable
      on:click="{onEmptyFieldClick}">
    </div>
  {/if}

</div>
