<script lang="ts">
  import {modalService, soundService} from "services";
  import {playerStore} from "stores";
  import {CurrencyComponent, TextComponent} from "ui";
  import RewardsComponent from "./modals/Rewards.svelte";

  $: ees = BigInt($playerStore.rewards.ees);
  $: ecr = BigInt($playerStore.rewards.ecr);

  let onViewRewards = (): void => {
    soundService.play("click");
    modalService.open(RewardsComponent);
  };
</script>

<style>
  .rewards {
    padding: var(--md);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--xl);
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border-color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  .rewards:hover {
    border-color: rgba(var(--grey), var(--opacity-sm));
    cursor: pointer;
  }

  .rewards__currencies {
    display: flex;
    gap: calc(var(--md) * 2);
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="rewards" on:click="{onViewRewards}">
  <TextComponent isBold>REWARDS</TextComponent>
  <div class="rewards__currencies">
    <CurrencyComponent iconSize="sm" name="ees" number="{ees}"/>
    <CurrencyComponent iconSize="sm" name="ecr" number="{ecr}"/>
  </div>
</div>
