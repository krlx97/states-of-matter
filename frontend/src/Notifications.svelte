<script lang="ts">
  import {fade, fly, type FlyParams} from "svelte/transition";
  import {notificationsStore} from "stores";
  import { TextComponent } from "ui";
    import { soundService } from "services";

  const inFly: FlyParams = {
    x: 100,
    duration: 400
  };

  const onCloseNotification = (notification: any): void => {
    const n = $notificationsStore.find(({id}) => notification.id === id);

    if (n) {
      $notificationsStore.splice($notificationsStore.indexOf(n), 1);
      $notificationsStore = $notificationsStore;
    }

    soundService.play("click");
  };
</script>

<style>
  .notifications {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 320px;
  }

  .notification {
    margin: var(--sm);
    padding: var(--sm);
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    border: 1px solid rgb(var(--warn));
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .isPrimary {
    border-color: rgb(var(--primary));
  }
  .isSuccess {
    border-color: rgb(var(--success));
  }
  .isWarn {
    border-color: rgb(var(--warn));
  }
</style>

<div class="notifications">
  {#each $notificationsStore as {id, color, message} (id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="notification"
      in:fly={inFly}
      out:fade
      class:isPrimary="{color === "primary"}"
      class:isSuccess="{color === "success"}"
      class:isWarn="{color === "warn"}" on:click="{() => onCloseNotification({id, color, message})}">
      <TextComponent {color}>{message}</TextComponent>
    </div>
  {/each}
</div>
