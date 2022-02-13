<script lang="ts">
  import {playerStore} from "stores/data";
  import Token from "./Token.svelte";

  const tokens = [
    {name: "Telos",           token: "TLOS",  amount: $playerStore.wallet[0]},
    {name: "Light Matter",    token: "LMT",   amount: $playerStore.wallet[1]},
    {name: "Dark Matter",     token: "DMT",   amount: "0 DMT"},
    {name: "Atmos",           token: "ATMOS", amount: "0.0000 ATMOS"}
  ];
</script>

<style lang="scss">
  @import "../../../shared/styles/variables";

  .tokens {
    height: 100%;
    width: 320px;
    padding: $spacing-md;
    border-right: 2px solid $light-grey;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>

<div class="tokens">
  {#each tokens as token}
    <Token {token}/>
  {/each}
</div>
