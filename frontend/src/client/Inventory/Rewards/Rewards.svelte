<script lang="ts">
  import {modalService, socketService, soundService} from "services";
  import {inventoryStore, playerStore} from "stores";
  import {ButtonComponent, CurrencyComponent} from "ui";
  import Rewards from "./modals/Rewards.svelte";

  const onViewRewards = (): void => {
    modalService.open(Rewards);
    soundService.play("click");
  };

  const onClaimRewards = (): void => {
    soundService.play("click");
    socketService.socket.emit("claimRewards");
  };
</script>

<style>
  .bar {
    padding: var(--md);
    width: 192px;
    display: flex;
    flex-direction: column;
    gap: var(--md);
    /* background-color: rgb(var(--dark-grey)); */
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
  }

  .bar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md);
  }

  .bar__header__title {
    font-size: var(--lg);
  }
  .bar__header__actions {
    display: flex;
    gap: var(--md);
  }

  .bar__currency {
    align-self: center;
  }
</style>

<div class="bar">
  <div class="bar__header">
    <b class="bar__header__title">Rewards</b>
    <div class="bar__header__actions">
      <ButtonComponent isIcon on:click="{onViewRewards}">?</ButtonComponent>
      <ButtonComponent isIcon on:click="{onClaimRewards}">₿</ButtonComponent>
    </div>
  </div>
  <div class="bar__currency">
    <CurrencyComponent iconSize="sm" name="ecr" number="{BigInt($playerStore.rewards.ecr)}"/>
  </div>
  <div class="bar__currency">
    <CurrencyComponent iconSize="sm" name="ees" number="{BigInt($playerStore.rewards.ees)}"/>
  </div>
</div>
