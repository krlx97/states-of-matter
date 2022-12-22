<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores";
  import {accountStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  const getDate = (ts: number): string => {
    return new Date(ts * 1000).toLocaleString("en-GB", {
      timeZone: "UTC"
    });
  };

  const onClaim = (key: number): void => {

  };
</script>

<style>
  .claimw {
    width: 320px;
  }
  .claim {
    padding: var(--spacing-md);
    margin: var(--spacing-md) 0;
    /* box-sizing: border-box;
    box-shadow: var(--elevation-lg); */
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    /* background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    ); */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .claim__text {
    line-height: 1.4;
  }
  .date {
    font-size: var(--font-sm);
  }
</style>

<Modal>
  <div class="claimw">
    <h3>Claim</h3>
    <p>
      Unstaking tokens which have vested can be claimed here.
    </p>
    <div class="claims">
      {#if $modalStore.data.claimable.length}
        {#each $modalStore.data.claimable as claim}
          <div class="claim">
            <div class="claim__text">
              <div>{claim.value}</div>
              <div class="date">{getDate(claim.key)}</div>
            </div>
            <button on:click={() => onClaim(claim.key)}>CLAIM</button>
          </div>
        {/each}
      {:else}
        You have no unstaking batches.
      {/if}
    </div>
  </div>
</Modal>
