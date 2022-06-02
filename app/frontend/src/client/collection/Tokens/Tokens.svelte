<script lang="ts">
  import {playerStore} from "stores";
  import Token from "./Token.svelte";

  const tokens = [
    {name: "Telos",           token: "TLOS", ticker: "TLOS", amount: $playerStore.wallet[0], chain_id: 0},
    {name: "Light Matter",    token: "LMT",   ticker: "LMTTEST",amount: $playerStore.wallet[1], chain_id: 1},
    {name: "Dark Matter",     token: "DMT", ticker: "DMTTEST",  amount: $playerStore.wallet[2], chain_id: 2},
    {name: "Atmos",           token: "ATMOS", ticker: "ATMOS",amount: $playerStore.wallet[3], chain_id: 3}
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

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: $dark-grey;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $light-grey;
      border: 1px solid transparent;
      border-radius: 8px;
      box-sizing: border-box;
    }
  }
</style>

<div class="tokens">
  {#each tokens as token}
    <Token {token}/>
  {/each}
</div>
