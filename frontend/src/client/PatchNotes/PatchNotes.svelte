<script lang="ts">
  import {TextComponent} from "ui";
</script>

<style>
  .patch-notes {
    height: 836px;
    padding: var(--md);
    line-height: 1.25;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>

<div class="patch-notes">
  Patch notes:
  <div>
    <TextComponent color="primary">v0.4.0 [8th of April, 2024]</TextComponent> Open Beta release - 28 cards playable.
  </div>
  <hr/>

  <div>
    <TextComponent color="primary">v0.4.1 [6th of May, 2024]</TextComponent> Important bugfixes.<br/>
    <TextComponent color="success">BUGFIXES</TextComponent><br/>
    <ul>
      <li>Game turn timer won't break anymore, which caused players to be stuck in an infinite game.</li>
      <li>Re-logging while you're in game wont break the UI anymore, making the game unplayable.</li>
    </ul>
  </div>
  <hr/>

  <div>
    <TextComponent color="primary" size="xl">v0.5.0 [nth of May, 2024]</TextComponent> - Bugfixes, Features, Gas cards.<br/>

    <TextComponent color="success">BUGFIXES</TextComponent><br/>
    <ul>
      <li>Add friend, join lobby and rename deck dialogs now work.</li>
      <li>Players are now removed from the queue when they disconnect.</li>
      <li>Leaderboards by level take into account experience as well.</li>
      <li>Leaderboards by elo take into account level and experience as well.</li>
      <li>
        <TextComponent color="solid">Pact</TextComponent>
        can no longer be played when none of your field units have shield.
      </li>
      <li>
        <TextComponent color="solid">Pact</TextComponent>
        and
        <TextComponent color="neutral">Reflection</TextComponent>
        no longer ignore enemy Heroes shield.
      </li>
      <li>
        <TextComponent color="neutral">Avet</TextComponent>
        and
        <TextComponent color="solid">Dendrites</TextComponent>
        effects now display damage dealt animation.
      </li>
      <li>
        <TextComponent color="plasma">Zendario's Electrocute</TextComponent>
        ability now displays damage dealt animation.
      </li>
      <li>
        <TextComponent color="liquid">Olatea</TextComponent>,
        <TextComponent color="gas">Isaac</TextComponent> and
        <TextComponent color="plasma">Zendario</TextComponent>
        have correct names in the inventory tab.
      </li>
    </ul>

    <TextComponent color="success">NEW CONTENT</TextComponent><br/>
    <ul>
      <li><TextComponent color="gas">12 Gas cards released</TextComponent></li>
    </ul>

    <TextComponent color="success">NEW FEATURES</TextComponent><br/>
    <ul>
      <li>Decks can now be exported and imported for easier sharing.</li>
      <li>Client cards have a new on-hover tooltip.</li>
      <li>Avatars, Banners and Card Skins are now selected in the inventory tab.</li>
      <li>There will be a discord notification whenever somebody joins Casual or Ranked queue.</li>
    </ul>

    <TextComponent color="success">BALANCE</TextComponent><br/>
    <ul>
      <li>
        <TextComponent color="neutral">Sleeper</TextComponent>:
        <TextComponent color="mana">Mana Cost</TextComponent>
        8 ⇒ 5.
      </li>
    </ul>

  </div>
  <br/>

  Roadmap:
  <div>
    <TextComponent color="primary">[Q2 2024] v1.0</TextComponent> Official release - all 64 cards playable. <TextComponent color="success">Airdrop: 5% players</TextComponent><br/>
    <TextComponent color="primary">[Q3 2024] v1.1</TextComponent> Tournament custom lobbies. <TextComponent color="success">Airdrop: 10% players</TextComponent><br/>
    <TextComponent color="primary">[Q4 2024] v1.2</TextComponent> Full player profiles, match history and replays. <TextComponent color="success">Airdrop: 20% players, 10% dev</TextComponent><br/>
    <TextComponent color="primary">[Q1 2025] v2.0</TextComponent> Game server on TelosZero, making it always online. <TextComponent color="success">Airdrop: 40% players, 15% dev</TextComponent><br/>
  </div>
</div>
