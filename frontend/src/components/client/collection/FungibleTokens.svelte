<script lang="ts">
  const tokens = [
    {name: "Telos", token: "TLOS", amount: 1337.1337},
    {name: "Fragments of Matter", token: "FOM", amount: 61234.1234},
    {name: "Atmos", token: "ATMOS", amount: 3490.1234}
  ];
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .fungible-tokens {
    width: 320px;
    padding: $spacing-md;

    border: 2px solid blue;
    box-sizing: border-box;

    &__token {
      margin-bottom: $spacing-md;
      padding: $spacing-md;
      display: flex;
      align-items: center;
      background-color: $light-grey;
      border-radius: 4px;
      box-shadow: $elevation-sm;

      &:last-child { margin-bottom: 0; }

      &__img {
        height: 48px;
        width: 48px;
        margin-right: $spacing-md;
      }

      &__content {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>

<div class="fungible-tokens">
  <h3>Fungible Tokens</h3>

  {#each tokens as {name, token, amount}}
    <div class="fungible-tokens__token">
      <img class="fungible-tokens__token__img" src="assets/currencies/{token}.png" alt={name}/>
      <div class="fungible-tokens__token__content">
        <span>{name}</span>
        <span>{amount}</span>
      </div>
    </div>
  {/each}
</div>
