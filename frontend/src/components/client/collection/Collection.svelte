<script lang="ts">
  import FungibleTokens from "./FungibleTokens.svelte";
  import NonFungibleTokens from "./NonFungibleTokens.svelte";
  import Wallet from "./Wallet.svelte";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .collection {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    border: 2px solid red;
    box-sizing: border-box;

    &__tokens {
      flex-grow: 1;
      display: flex;
      justify-content: space-evenly;

      &__fungible {
        flex-shrink: 1;
      }

      &__non-fungible {
        flex-grow: 1;
      }
    }
  }
</style>

<div class="collection">
  <Wallet/>
  <div class="collection__tokens">
    <div class="collection__tokens__fungible">
      <FungibleTokens/>
    </div>
    <div class="collection__tokens__non-fungible">
      <NonFungibleTokens/>
    </div>
  </div>
</div>
