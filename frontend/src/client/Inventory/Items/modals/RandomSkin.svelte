<script lang="ts">
  import {items} from "@som/shared/data";
  import {modalService, soundService} from "services";
  import {modalStore} from "stores";
  import {ButtonComponent, ModalComponent} from "ui";
  import RevealShardComponent from "./RevealShard.svelte";

  const {ids} = $modalStore.data;
  let reveals = 0;

  const itemz = ids.map((id: bigint) => {
    const item = items.find((item) => item.id === (parseInt(id.toString()) / 10));
    return item;
  });

  const onReveal = (): void => {
    reveals += 1;
  };

 const onClose = (): void => {
    soundService.play("click");
    modalService.close();
  };
</script>

<style>
  .items {
    display: flex;
    padding: var(--md);
    gap: var(--md);
  }
</style>

<ModalComponent isClosable="{false}" dark width="532px">
  <svelte:fragment slot="title">Shard pack opened</svelte:fragment>

  <svelte:fragment slot="info">
    You opened a shard pack and received one random shard from each rarity list.
    Click to reveal the shards.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <div class="items">
      {#each itemz as item}
        <RevealShardComponent {item} on:reveal="{onReveal}"/>
      {/each}
    </div>
    <div style="display: flex; justify-content: center;">
      <ButtonComponent disabled="{reveals < 4}" on:click="{onClose}">
        CLOSE
      </ButtonComponent>
    </div>
  </svelte:fragment>
</ModalComponent>
