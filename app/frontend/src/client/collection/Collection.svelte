<script lang="ts">
  import Tokens from "./Tokens/Tokens.svelte";
  import NonFungibleTokens from "./NonFungibleTokens.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .collection {
    height: 100%;
    width: 100%;
    @include flex();
  }
</style>

<div class="collection">
  <Tokens/>
  <NonFungibleTokens/>
</div>
