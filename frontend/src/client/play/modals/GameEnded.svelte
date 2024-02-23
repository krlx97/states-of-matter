<script lang="ts">
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";
  import {GameType} from "@som/shared/enums";
  import {modalStore, playerStore} from "stores";
  import {ButtonComponent, CurrencyComponent, ModalComponent, PlayerFrameComponent, TextComponent} from "ui";
  import { modalService } from "services";

  let {
    isWinner,
    gameType,
    experience,
    elo,
    playerDaily,
    eesReward,
    animations
  } = $modalStore.data;

  let isLevelup = false;

  const onClose = (): void => {
    modalService.close();
  };

  onMount((): void => {
    let experienceSum = 0;
    let eloSum = 0;

    const animateExperience = (): void => {
      $playerStore.experience += 1;
      experienceSum += 1;

      if ($playerStore.experience > 1000) {
        $playerStore.experience = 0;
        $playerStore.level += 1;
      }

      if (experienceSum < experience) {
        requestAnimationFrame(animateExperience);
      }
    };

    const animateElo = (): void => {
      if (elo < 0) { // lost elo
        $playerStore.elo -= 1;
        eloSum -= 1;

        if (eloSum > elo) {
          setTimeout((): void => { requestAnimationFrame(animateElo); }, 50);
        }
      } else { // gained elo
        $playerStore.elo += 1;
        eloSum += 1;

        if (eloSum < elo) {
          setTimeout((): void => { requestAnimationFrame(animateElo); }, 50);
        }
      }
    };

    requestAnimationFrame(animateExperience);

    if (gameType === GameType.RANKED) {
      requestAnimationFrame(animateElo);
    }
  });
</script>

<style>
  .game-ended {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
  }

  .game-ended__header {
    font-size: var(--xl);
    text-align: center;
  }

  .levelup {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
    margin-top: var(--md);
  }

  .assets {
    display: flex;
    justify-content: center;
    gap: var(--md);
    width: 100%;
  }

  .reward-asset {
    padding: var(--md);
    border: 1px solid rgb(127, 127, 127);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: var(--font-lg);
    border-radius: 8px;
    flex-basis: 50%;
  }
</style>

<ModalComponent dark isClosable="{false}" width="400px">
  <div class="game-ended">

    <div class="game-ended__header">
      {#if isWinner}
        <TextComponent color="success">YOU WIN!</TextComponent>
      {:else}
        <TextComponent color="warn">YOU LOSE...</TextComponent>
      {/if}
    </div>

    {#if gameType === GameType.CASUAL || gameType === GameType.RANKED}
      <div>gained {experience} experience</div>
      {#if gameType === GameType.RANKED}
        <div>{isWinner ? "gained" : "lost"} {Math.abs(elo)} elo</div>
      {/if}
      {#if playerDaily}
        <div>Daily task complete!</div>
      {/if}
      {#if BigInt(eesReward) > 0n}
        <div>Level up!</div>
        <div style="display: flex; align-items: center;">
          + <CurrencyComponent iconSize="sm" name="ees" number="{eesReward}"/>
        </div>
      {/if}
    {/if}

    {#key $playerStore.experience || $playerStore.elo}
      <PlayerFrameComponent
        name="{$playerStore.name}"
        experience="{$playerStore.experience}"
        level="{$playerStore.level}"
        elo="{$playerStore.elo}"
        avatarId="{$playerStore.avatarId}"
        bannerId="{$playerStore.bannerId}"
        games="{$playerStore.games}"/>
    {/key}
  </div>

  <div style="display: flex; justify-content: center;">
    <ButtonComponent type="button" on:click="{onClose}">CLOSE</ButtonComponent>
  </div>
</ModalComponent>
