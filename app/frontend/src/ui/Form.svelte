<script lang="ts">

</script>

<style lang="scss">
  @import "../shared/styles/variables";

  form {
    padding: $spacing-md;
    box-sizing: border-box;
  }
</style>

<form on:submit|preventDefault><slot/></form>
