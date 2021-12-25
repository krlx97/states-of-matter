<script lang="ts">
  import {Button, Text, FontAwesome} from "components";
  import {miscService} from "services";
  import {playerStore} from "stores/data";

  let isPrivateKeyVisible = false;

  const onTogglePrivateKeyVisible = (): void => {
    isPrivateKeyVisible = !isPrivateKeyVisible
  };

  const onCopyPublicKey = async (): Promise<void> => {
    await navigator.clipboard.writeText($playerStore.publicKey);
    miscService.showNotification("Copied to clipboard.");
  };

  const onCopyPrivateKey = async (): Promise<void> => {
    await navigator.clipboard.writeText($playerStore.privateKey);
    miscService.showNotification("Copied to clipboard.");
  };
</script>

<style lang="scss">
  .wallet {
    /* height: 100%; */
    width: 100%;
    
    padding: var(--spacing-md);
    box-sizing: border-box;

    border: 2px solid green;
    box-sizing: border-box;
  }

  .key {
    font-family: monospace;
  }
  .wallet__keys {
    display: flex;
    justify-content: space-evenly;
  }
  .wallet__key {
    display: flex;
    flex-direction: column;
    align-items: center;
    
  }
  .wallet__key__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div class="wallet">

  <div class="wallet__keys">

    <div class="wallet__key">
      <header class="wallet__key__header">
        <p>
          Public Key
        </p>
        <div class="wallet__key__header__actions">
          <Button style="icon" on:click={onCopyPublicKey}>
            <FontAwesome icon="copy"/>
          </Button>
        </div>
      </header>
      <h3 class="key f--purple">
        {$playerStore.publicKey}
      </h3>
    </div>

    <div class="wallet__key">
      <header class="wallet__key__header">
        <p>
          Private Key
        </p>
        <div class="wallet__key__header__actions">
          <Button style="icon" on:click={onTogglePrivateKeyVisible}>
            <FontAwesome icon={isPrivateKeyVisible ? "eye" : "eye-slash"}/>
          </Button>
          <Button style="icon" on:click={onCopyPrivateKey}>
            <FontAwesome icon="copy"/>
          </Button>
        </div>
      </header>

      <Text color="purple" font="monospace">
        {#if isPrivateKeyVisible}
          {$playerStore.privateKey}
        {:else}
          {$playerStore.privateKey.split("").map(() => "*").join("")}
        {/if}
      </Text>
    </div>

  </div>

</div>
