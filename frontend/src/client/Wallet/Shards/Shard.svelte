<script lang="ts">
  import {ItemComponent} from "ui";
  import {modalService} from "services";
  import ExploreComponent from "./modals/Explore.svelte";

  let shard: any;

  const onExplore = (): void => {
    const {id} = shard;
    modalService.open(ExploreComponent, {id});
  };

  export {shard};
</script>

<div on:click={onExplore} on:keypress={onExplore}>
  <ItemComponent item={shard}/>
</div>
