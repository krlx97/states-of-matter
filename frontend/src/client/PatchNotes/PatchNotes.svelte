<script lang="ts">
  import {TextComponent} from "ui";
</script>

<style>
  .patch-notes {
    padding: var(--md);
    line-height: 1.25;
  }
</style>

<div class="patch-notes">
  Patch notes:
  <div>
    <TextComponent color="primary">v0.4.0</TextComponent> Open Beta release - 24 cards playable.
  </div>
  <br/>
  Roadmap:
  <div>
    <TextComponent color="primary">v1.0.0</TextComponent> Official release - all 60 cards playable.<br/>
    <TextComponent color="primary">v1.1.0</TextComponent> Tournament custom lobbies.<br/>
    <TextComponent color="primary">v1.2.0</TextComponent> Player profile expansion: match history, match replays, and inventories.<br/>
    <TextComponent color="primary">v1.3.0</TextComponent> Game server rewritten for TelosZero, making it forever online.
  </div>
</div>
