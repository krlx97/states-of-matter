<script lang="ts">
  import {gameStore} from "stores";
  import {CardComponent} from "ui";
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
    top: -166px;
    left: 50%;
    transform: translateX(-50%) scale(0.6);

  }
</style>

{#if $gameStore.player.trap}
  <div class="field">
    <span>?</span>
    <div class="field-card">
      <CardComponent card={$gameStore.player.trap}/>
    </div>
  </div>
{/if}
