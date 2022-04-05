<script lang="ts">
  import {miscService} from "services";
  import {playerStore} from "stores";
  import Button from "../../ui/Button.svelte";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import Text from "../../ui/Text.svelte";

  let isPrivateKeyVisible = false;

  const onTogglePrivateKeyVisible = () => {
    isPrivateKeyVisible = !isPrivateKeyVisible
  };

  const onCopyPublicKey = async () => {
    await navigator.clipboard.writeText($playerStore.publicKey);
    miscService.showNotification("Copied to clipboard.");
  };

  const onCopyPrivateKey = async () => {
    await navigator.clipboard.writeText($playerStore.privateKey);
    miscService.showNotification("Copied to clipboard.");
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .wallet {
    padding: $spacing-md;
    border-bottom: 2px solid $light-grey;
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
      <div class="wallet__key__header">
        <Text>Private Key</Text>
        <div class="wallet__key__header__actions">
          <Button style="icon" on:click={onTogglePrivateKeyVisible}>
            <FontAwesome icon={isPrivateKeyVisible ? "eye" : "eye-slash"}/>
          </Button>
          <Button style="icon" on:click={onCopyPrivateKey}>
            <FontAwesome icon="copy"/>
          </Button>
        </div>
      </div>

      <Text color="purple" isMonospace>
        {#if isPrivateKeyVisible}
          {$playerStore.privateKey}
        {:else}
          {$playerStore.privateKey.split("").map(() => "*").join("")}
        {/if}
      </Text>
    </div>

  </div>

</div>
