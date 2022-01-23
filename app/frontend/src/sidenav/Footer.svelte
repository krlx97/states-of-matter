<script lang="ts">
  import Button from "../ui/Button.svelte";
</script>

<style>
  .footer {
    padding: var(--spacing-sm) 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-top: 2px solid rgb(var(--light-grey));
    box-sizing: border-box;
  }
  .icon {
    height: 32px;
    width: 32px;
  }
</style>

<footer class="footer">
  <Button style="icon" color="grey">
    <img class="icon" src="assets/social-media/discussions.png" alt="Discussions"/>
  </Button>
  <Button style="icon" color="grey">
    <img class="icon" src="assets/social-media/discord.png" alt="Discord"/>
  </Button>
</footer>
