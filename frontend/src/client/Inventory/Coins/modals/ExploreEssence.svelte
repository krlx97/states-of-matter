<script lang="ts">
  import {CurrencyComponent, ModalComponent} from "ui";
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Etheric Essence</div>
    <div class="modal__info">
      When the energy from the shard is taken out by a powerful mage or a hero,
      it becomes only a shell, a somewhat beautiful stone. Drained energy can be
      converted by humans and other beings so they become stronger and more
      powerful, or it can be stored in other containers. Then it can be used as
      an amulet or a magical weapon or tool.
    </div>
    <table>
      <h3>PLAYING</h3>
      <tr>
        <td>EVERY LEVEL</td>
        <td><CurrencyComponent name="ese" number={1n}/></td>
      </tr>
      <tr>
        <td>EVERY 10 LEVELS</td>
        <td><CurrencyComponent name="ese" number={30n}/></td>
      </tr>
      <tr>
        <td>EVERY 100 LEVELS</td>
        <td><CurrencyComponent name="ese" number={600n}/></td>
      </tr>
      <tr>
        <td>FIRST DAILY WIN</td>
        <td><CurrencyComponent name="ese" number={3n}/></td>
      </tr>
      <h3>DISENCHANTING SKINS</h3>
      <tr>
        <td class="green">TIER 1 UNCOMMON</td>
        <td><CurrencyComponent name="ese" number={50n}/></td>
      </tr>
      <tr>
        <td class="green">TIER 2 UNCOMMON</td>
        <td><CurrencyComponent name="ese" number={500n}/></td>
      </tr>
      <tr>
        <td class="blue">TIER 1 RARE</td>
        <td><CurrencyComponent name="ese" number={1000n}/></td>
      </tr>
      <tr>
        <td class="blue">TIER 2 RARE</td>
        <td><CurrencyComponent name="ese" number={10000n}/></td>
      </tr>
      <tr>
        <td class="lt-purple">TIER 1 EPIC</td>
        <td><CurrencyComponent name="ese" number={20000n}/></td>
      </tr>
      <tr>
        <td class="lt-purple">TIER 2 EPIC</td>
        <td><CurrencyComponent name="ese" number={200000n}/></td>
      </tr>
    </table>
  </div>
</ModalComponent>
