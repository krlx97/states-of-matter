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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click="{onSetDeckKlass}" on:contextmenu|preventDefault="{onViewLore}">
  <CardComponent {card} health="{0}" mana="{0}"/>
</div>
