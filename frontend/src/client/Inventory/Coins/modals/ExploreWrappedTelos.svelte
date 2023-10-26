<script lang="ts">
  import {CurrencyComponent, ModalComponent} from "ui";
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Etheric Telos</div>
    <div class="modal__info">
      Transform your native Telos token into an ERC1155 Wrapped Telos token to
      ensure compatibility with the game. Utilize this token to acquire Etheric
      Crystals or participate in liquidity provision.
    </div>
    <table>
      <tr>
        <td>TOTAL WRAPPED</td>
        <td><CurrencyComponent name="wtlos" number="{10000n * 10n ** 18n}"/></td>
      </tr>
    </table>
  </div>
</ModalComponent>
