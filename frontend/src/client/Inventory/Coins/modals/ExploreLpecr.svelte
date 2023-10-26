<script lang="ts">
  import {formatUnits} from "ethers";
  import {walletStore} from "stores";
  import {CurrencyComponent, ModalComponent, ProgressBarComponent} from "ui";

  const {totalSupply, staked, unstaked} = $walletStore.lpecrGlobal;
  const liquid = totalSupply - (staked + unstaked);

  const convert = (val) => parseFloat(formatUnits(val));

  const liquidPercent = (convert(liquid) / convert($walletStore.lpecrGlobal.totalSupply) * 100).toFixed(2);
  const stakedPercent = (convert($walletStore.lpecrGlobal.staked) / convert($walletStore.lpecrGlobal.totalSupply) * 100).toFixed(2);
  const unstakedPercent = (convert($walletStore.lpecrGlobal.unstaked) / convert($walletStore.lpecrGlobal.totalSupply) * 100).toFixed(2);

  const bars = [{
    color: "green",
    progress: liquidPercent
  }, {
    color: "purple",
    progress: stakedPercent
  }, {
    color: "blue",
    progress: unstakedPercent
  }];
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Etheric Energy</div>
    <div class="modal__info">
      Provide WTLOS + ECR to liquidity pool to receive LPECR, and accumulate swap fees as you hold the LPECR token.
      Additionally you can stake the LPECR token, to get additional Staked ECR rewards from the revenue sharing.
    </div>
    <div class="modal__table">
      <table>
        <tr>
          <td>ISSUED</td>
          <td><CurrencyComponent name="lpecr" number={$walletStore.lpecrGlobal.totalSupply}/></td>
        </tr>
        <br/>
        <tr>
          <td class="lt-green">LIQUID [{liquidPercent}%]</td>
          <td><CurrencyComponent name="lpecr" number={liquid}/></td>
        </tr>
        <tr>
          <td class="lt-purple">STAKED [{stakedPercent}%]</td>
          <td><CurrencyComponent name="lpecr" number={$walletStore.lpecrGlobal.staked}/></td>
        </tr>
        <tr>
          <td class="lt-blue">UNSTAKED [{unstakedPercent}%]</td>
          <td><CurrencyComponent name="lpecr" number={$walletStore.lpecrGlobal.unstaked}/></td>
        </tr>
      </table>
    </div>
    <ProgressBarComponent {bars}/>
  </div>
</ModalComponent>
