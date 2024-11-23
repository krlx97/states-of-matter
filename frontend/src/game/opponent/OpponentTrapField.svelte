<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .field {
    position: relative;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--warn));
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 1px 2px rgb(var(--warn));
    animation: glowred 600ms linear infinite alternate;
  }

  @keyframes glowred {
    from {
      background-color: transparent;
    } to {
      background-color: rgb(var(--warn));
    }
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
