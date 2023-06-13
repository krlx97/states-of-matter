<script lang="ts">
  import {modalService} from "services";
  import {deckStore} from "stores";
  import {CardComponent} from "ui";
  import CardLoreComponent from "./modals/CardLore.svelte";

  let card: any;

  const onSetDeckKlass = (): void => {
    $deckStore.klass = card.klass;
  };

  const onViewLore = (): void => {
    modalService.open(CardLoreComponent, card);
  };

  export {card};
</script>

<div
  on:click={onSetDeckKlass}
  on:keypress={onSetDeckKlass}
  on:contextmenu|preventDefault={onViewLore}
>
  <CardComponent {card} health={0} mana={0}/>
</div>
