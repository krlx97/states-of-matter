<script lang="ts">
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";
  import {GameType} from "@som/shared/enums";
  import {modalStore, playerStore} from "stores";
  import {ButtonComponent, CurrencyComponent, ModalComponent, PlayerFrameComponent, TextComponent} from "ui";
  import { modalService } from "services";

  const {isWinner, gameType, experience, elo, ecrReward, eesReward} = $modalStore.data;
  let isLevelup = false;
  let isFinished = false;
  let isClosable = false;

  const onClose = (): void => {
    modalService.close();
  };

  onMount((): void => {
    setTimeout((): void => {
      const animateValue = (): void => {
        let sum = 0;
        let sum2 = 0;

        const step2 = (): void => {
          if (elo < 0) { // lost elo
            $playerStore.elo -= 1;
            sum2 -= 1;

            if (sum2 > elo) {
              setTimeout(() => {
                requestAnimationFrame(step2);
              }, 100);
            }
          } else { // gained elo
            $playerStore.elo += 1;
            sum2 += 1;

            if (sum2 < elo) {
              setTimeout(() => {
                requestAnimationFrame(step2);
              }, 100);
            } else {
              isFinished = true;
              setTimeout(() => {isClosable=true;}, 800);
            }
          }
        };

        const step = (): void => {
          $playerStore.experience += 1;
          sum += 1;

          if ($playerStore.experience > 1000) {
            $playerStore.experience = 0;
            $playerStore.level += 1;
            isLevelup = true;
          }

          if (sum < experience) {
            requestAnimationFrame(step);
          } else {
            if (gameType === GameType.RANKED) {
              requestAnimationFrame(step2);
            } else {
              isFinished = true;
              isClosable=true;
            }
          }
        };

        window.requestAnimationFrame(step);
      }

      animateValue();
    }, 1000);
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
      <div>+{experience} experience</div>
      {#if gameType === GameType.RANKED}
        <div>+{elo} elo</div>
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
        games="{$playerStore.games}"
      />
    {/key}

    {#if isFinished}
      <div class="levelup">
        <div class="assets">
          {#if BigInt(ecrReward) > 0n}
            <div class="reward-asset" in:fade={{delay: 0, duration: 400}}>
              <CurrencyComponent iconSize="sm" name="ecr" number="{ecrReward}"/>
            </div>
          {/if}
          {#if BigInt(eesReward) > 0n}
            <div class="reward-asset" in:fade={{delay: 400, duration: 400}}>
              <CurrencyComponent iconSize="sm" name="ees" number="{eesReward}"/>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  {#if isClosable}
    <div style="display: flex; justify-content: center;">
      <ButtonComponent on:click="{onClose}">CLOSE</ButtonComponent>
    </div>
  {/if}
</ModalComponent>
