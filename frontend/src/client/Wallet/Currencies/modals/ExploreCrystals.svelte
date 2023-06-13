<script lang="ts">
  import {walletStore} from "stores";
  import {CurrencyComponent, ModalComponent, ProgressBarComponent} from "ui";

  const liquid = $walletStore.crystalsGlobal.totalSupply.sub(
$walletStore.crystalsGlobal.staked.add(
$walletStore.crystalsGlobal.unstaked.add(
$walletStore.crystalsGlobal.burned
)));
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
          <td>SUPPLY CAP</td>
          <td>
            <CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.cap}/>
          </td>
        </tr>
        <tr>
          <td>ISSUED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.totalSupply}/></td>
        </tr>
        <br/>
        <tr>
          <td class="blue">LIQUID</td>
          <td><CurrencyComponent name="crystals" number={liquid}/></td>
        </tr>
        <tr>
          <td class="green">STAKED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.staked}/></td>
        </tr>
        <tr>
          <td style="color: rgb(255, 139, 0);">UNSTAKED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.unstaked}/></td>
        </tr>
        <tr>
          <td class="red">BURNED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.burned}/></td>
        </tr>
      </table>
    </div>
    <ProgressBarComponent bars={[{
      color: "blue",
      progress: 30
    }, {
      color: "green",
      progress: 25
    }, {
      color: "orange",
      progress: 35
    }, {
      color: "red",
      progress: 10
    }]}/>
  </div>
</ModalComponent>
