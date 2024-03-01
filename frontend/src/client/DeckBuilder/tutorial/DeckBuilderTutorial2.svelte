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
  <TextComponent color="mana">mana cost</TextComponent>,
  <TextComponent color="mana">mana capacity</TextComponent>.
  <hr/>
  Classes:
  <br/>
  <div class="icon">
    <img src="images/card/0.png" alt="Neutral"/>
    Neutral (General Purpose)<br/>
  </div>
  <div class="icon">
    <img src="images/card/1.png" alt="Solid"/> Solid (Durability)<br/>
  </div>
  <div class="icon">
    <img src="images/card/2.png" alt="Liquid"/> Liquid (Utility)<br/>
  </div>
  <div class="icon">
    <img src="images/card/3.png" alt="Gas"/> Gas (Damage over time)<br/>
  </div>
  <div class="icon">
    <img src="images/card/4.png" alt="Plasma"/> Plasma (Burst Damage)<br/>
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
      <img src="images/card/healthx.png" alt="Health"/> Health<br/>
    </div>
    <div class="icon">
      <img src="images/card/damagex.png" alt="Damage"/> Damage<br/>
    </div>
    <div class="icon">
      <img src="images/card/manacostx.png" alt="Mana"/> Mana Capacity<br/>
    </div>
    <div class="icon">
      <img src="images/card/manax.png" alt="Mana Cost"/> Mana Cost<br/>
    </div>
  </div>
  <hr/>
  Left click any class, type or attribute icon on the card for more info.
  <br/>Right click the card to view it's lore and skins.
</div>
