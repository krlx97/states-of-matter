<script lang="ts">
  import {BigNumber, ethers} from "ethers";

  const {utils} = ethers;
  let name: "crystals" | "essence";
  let number: BigNumber;

  export {name, number};
</script>

<style>
  .currency {
    position: relative;
    cursor: pointer;
  }

  .currency__full {
    position: absolute;
    bottom: 100%;
    left: 50%;
    padding: var(--spacing-sm);
    display: none;
    transform: translateX(-50%);
  }

  .currency:hover .currency__full {
    display: initial;
    background-color: rgb(31, 31, 31);
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
  }

  img {
    margin-left: var(--spacing-xsm);
    display: inline;
    vertical-align: middle;
  }
</style>

<div class="currency">
  {utils.formatUnits(number.sub(number.mod(1e14)))}
  <img src="assets/currencies/sm/{name}.png" alt={name}/>
  <div class="currency__full">{utils.formatUnits(number)}</div>
</div>
