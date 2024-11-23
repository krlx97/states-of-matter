<script>
    import { TextComponent } from "ui";

</script>
<style>
  .attrs {
    display: flex;
    flex-wrap: wrap;
  }

  .icon {
    flex-basis: 50%;
    display: flex;
    gap: var(--xs);
    align-items: center;
    margin: 4px 0;
  }
</style>

<div class="modal__title" style="font-size: var(--xl)">Cards</div>
<div class="modal__info--tutorial" style="text-align: justify; line-height: 1.25">
  There are five card classes in States of Matter:
  <TextComponent color="neutral">neutral</TextComponent>,
  <TextComponent color="solid">solid</TextComponent>,
  <TextComponent color="liquid">liquid</TextComponent>,
  <TextComponent color="gas">gas</TextComponent> and
  <TextComponent color="plasma">plasma</TextComponent>,
  four card types: hero, minion, magic and trap, and the cards might have some of
  the following attributes:
  <TextComponent color="health">health</TextComponent>,
  <TextComponent color="damage">damage</TextComponent>,
  <TextComponent color="mana">mana</TextComponent>,
  <TextComponent color="mana">mana cost</TextComponent>.
  <hr/>
  Classes:
  <br/>
  <div class="icon">
    <img src="images/card/neutral.png" alt="Neutral"/>
    Neutral (General Purpose)<br/>
  </div>
  <div class="icon">
    <img src="images/card/solid.png" alt="Solid"/> Solid (Durability)<br/>
  </div>
  <div class="icon">
    <img src="images/card/liquid.png" alt="Liquid"/> Liquid (Utility)<br/>
  </div>
  <div class="icon">
    <img src="images/card/gas.png" alt="Gas"/> Gas (Damage over time)<br/>
  </div>
  <div class="icon">
    <img src="images/card/plasma.png" alt="Plasma"/> Plasma (Burst Damage)<br/>
  </div>
  Types:<br/>
  <div class="attrs">
    <div class="icon">
      <img src="images/card/hero.png" alt="Hero"/> Hero<br/>
    </div>
    <div class="icon">
      <img src="images/card/minion.png" alt="Minion"/> Minion<br/>
    </div>
    <div class="icon">
      <img src="images/card/magic.png" alt="Magic"/> Magic<br/>
    </div>
    <div class="icon">
      <img src="images/card/trap.png" alt="Trap"/> Trap<br/>
    </div>
  </div>
  Attributes:<br/>
  <div class="attrs">
    <div class="icon">
      <img src="images/card/health.png" alt="Health"/> Health<br/>
    </div>
    <div class="icon">
      <img src="images/card/damage.png" alt="Damage"/> Damage<br/>
    </div>
    <div class="icon">
      <img src="images/card/mana-cost.png" alt="Mana cost"/> Mana cost<br/>
    </div>
    <div class="icon">
      <img src="images/card/mana.png" alt="Mana"/> Mana<br/>
    </div>
  </div>
  <hr/>
  Left click any class, type or attribute icon on the card for more info.
  <br/>Right click the card to view it's lore and skins.
</div>
