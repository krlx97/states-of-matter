<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .field {
    position: relative;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--red));
    border-radius: 50%;
    box-shadow: var(--elevation-sm);
    cursor: pointer;
  }

  .field:hover .field-card {
    visibility: visible;
  }

  .field-card {
    visibility: hidden;
    position: absolute;
    top: -32px;
    left: 50%;
    width: 256px;
    transform: translateX(-50%);
  }
</style>

{#if $gameStore.opponent.trap}
  <div class="field">
    <span>?</span>
    <div class="field-card">
      Your opponent has set a trap card.
    </div>
  </div>
{/if}
