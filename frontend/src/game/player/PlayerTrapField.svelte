<script lang="ts">
  import {gameStore} from "stores";
  import {CardComponent} from "ui";
</script>

<style>
  .field {
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
    top: -114px;
    left: 50%;
    transform: translateX(-50%);
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
