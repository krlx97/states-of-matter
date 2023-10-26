<script lang="ts">
  import {formatUnits} from "ethers";
  import {walletStore} from "stores";
  import {CurrencyComponent, ModalComponent, ProgressBarComponent} from "ui";

  const liquid =
    $walletStore.crystalsGlobal.totalSupply - (
      $walletStore.crystalsGlobal.staked +
      $walletStore.crystalsGlobal.unstaked +
      $walletStore.crystalsGlobal.burned
    );

  const convert = (val) => parseFloat(formatUnits(val));

  const liquidPercent = (convert(liquid) / convert($walletStore.crystalsGlobal.totalSupply) * 100).toFixed(2);
  const stakedPercent = (convert($walletStore.crystalsGlobal.staked) / convert($walletStore.crystalsGlobal.totalSupply) * 100).toFixed(2);
  const unstakedPercent = (convert($walletStore.crystalsGlobal.unstaked) / convert($walletStore.crystalsGlobal.totalSupply) * 100).toFixed(2);
  const burnedPercent = (convert($walletStore.crystalsGlobal.burned) / convert($walletStore.crystalsGlobal.totalSupply) * 100).toFixed(2);
  const inflationPercent = (convert(100000n * 10n ** 18n) / convert($walletStore.crystalsGlobal.totalSupply) * 100).toFixed(2);
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Etheric Crystals</div>
    <div class="modal__info">
      Before the Fall, people used state issued coins to trade, buy goods and
      accumulate riches to go forward in the world. Nowadays, these coins are
      just relics of the old times. Scattered through the planet, shards in
      magnificent shades and shapes are used in a way similar to money. However,
      they are actually imbued with energy which is power itself, not just a
      mere convention.
    </div>
    <div class="modal__table">
      <table>
        <tr>
          <td>ISSUED</td>
          <td><CurrencyComponent name="ecr" number={$walletStore.crystalsGlobal.totalSupply}/></td>
        </tr>
        <tr>
          <td>INFLATION [{inflationPercent}%]</td>
          <td><CurrencyComponent name="ecr" number={100000n * 10n ** 18n}/></td>
        </tr>
        <tr>
          <td>AIRDROPS LEFT</td>
          <td>51251</td>
        </tr>
        <br/>
        <tr>
          <td class="lt-green">LIQUID [{liquidPercent}%]</td>
          <td><CurrencyComponent name="ecr" number={liquid}/></td>
        </tr>
        <tr>
          <td class="lt-purple">STAKED [{stakedPercent}%]</td>
          <td><CurrencyComponent name="ecr" number={$walletStore.crystalsGlobal.staked}/></td>
        </tr>
        <tr>
          <td class="lt-blue">UNSTAKED [{unstakedPercent}%]</td>
          <td><CurrencyComponent name="ecr" number={$walletStore.crystalsGlobal.unstaked}/></td>
        </tr>
        <tr>
          <td class="lt-red">BURNED [{burnedPercent}%]</td>
          <td><CurrencyComponent name="ecr" number={$walletStore.crystalsGlobal.burned}/></td>
        </tr>
      </table>
    </div>
    <ProgressBarComponent bars={[{
      color: "green",
      progress: liquidPercent
    }, {
      color: "purple",
      progress: stakedPercent
    }, {
      color: "blue",
      progress: unstakedPercent
    }, {
      color: "red",
      progress: burnedPercent
    }]}/>
  </div>
</ModalComponent>
