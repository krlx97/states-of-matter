<script lang="ts">
  import {modalService} from "services";
  import {ItemComponent} from "ui";
  import ExploreComponent from "./modals/Explore.svelte";

  let skin: any;

  const onExplore = (): void => {
    const {id} = skin;
    modalService.open(ExploreComponent, {id});
  };

  export {skin};
</script>

<div on:click={onExplore} on:keypress={onExplore}>
  <ItemComponent item={skin}/>
</div>
