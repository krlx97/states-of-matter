<script lang="ts">
  import { formatUnits, parseUnits } from "ethers";
  import {CurrencyComponent, ModalComponent} from "ui";

  // const perPlayer = parseUnits(parseFloat(formatUnits(100000000n * 10n ** 18n)) / 516);
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Tasks (8 / 13)</div>
    <div class="modal__info">
      Complete all tasks during the testnet phase to be eligible for an airdrop when
      the game goes to mainnet. Found any bugs? <a href="/">Let us know</a>.
    </div>
    <div class="modal__table">
      <table>
        <tr>
          <td>PLAYERS</td>
          <td>516</td>
        </tr>
        <br/>
        <tr>
          <td>AIRDROP</td>
          <td><CurrencyComponent name="ecr" number="{100000000n * 10n ** 18n}"/></td>
        </tr>
        <tr>
          <td>PER PLAYER</td>
          <td><CurrencyComponent name="ecr" number="{(100000000n * 10n ** 18n) / 516n}"/></td>
        </tr>
        <br/>
        <tr>
          <td>BUILD A DECK</td>
          <td class="lt-red">×</td>
        </tr>
        <tr>
          <td>CHANGE AVATAR</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>CHANGE BANNER</td>
          <td class="lt-red">×</td>
        </tr>
        <tr>
          <td>REACH LEVEL 10</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>ADD A FRIEND</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>CLAIM STARTER PACK</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>UNLOCK CHEST</td>
          <td class="lt-red">×</td>
        </tr>
        <tr>
          <td>FUSE SHARDS</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>SELECT ANY SKIN</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>SELL ITEM ON MARKET</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>BUY ITEM ON MARKET</td>
          <td class="lt-red">×</td>
        </tr>
        <tr>
          <td>STAKE TOKENS</td>
          <td class="lt-green">✓</td>
        </tr>
        <tr>
          <td>UNSTAKE TOKENS</td>
          <td class="lt-red">×</td>
        </tr>
      </table>
    </div>
    <div class="modal__submit lt-red">
      You are not eligible
    </div>
  </div>
</ModalComponent>
