<script lang="ts">

</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  form {
    width: 320px;
    // padding: $spacing-md;
    @include flex(column, center);
    // box-sizing: border-box;

    // border: 1px solid red;
  }
</style>

<form on:submit|preventDefault><slot/></form>
